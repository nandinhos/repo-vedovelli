import { Tag } from '../models/Tag';
import { Item } from '../models/Item';
import { ItemTag } from '../models/ItemTag';
import { Op } from 'sequelize';

// Helper function to create slug from name
function slugify(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // Remove non-word chars
        .replace(/[\s_-]+/g, '-')  // Replace spaces and underscores with -
        .replace(/^-+|-+$/g, '');   // Remove leading/trailing dashes
}

export class TagService {
    // Find or create a tag
    static async findOrCreate(name: string): Promise<Tag> {
        const normalizedName = name.toLowerCase().trim();
        const slug = slugify(normalizedName);

        const [tag] = await Tag.findOrCreate({
            where: { slug },
            defaults: {
                name: normalizedName,
                slug,
                usageCount: 0,
            },
        });

        return tag;
    }

    // Sync tags for an item (replace all tags)
    static async syncItemTags(itemId: string, tagNames: string[]): Promise<Tag[]> {
        const item = await Item.findByPk(itemId);
        if (!item) {
            throw new Error('Item not found');
        }

        // Remove duplicates and normalize
        const uniqueTagNames = [...new Set(tagNames.map(name => name.toLowerCase().trim()))];

        // Find or create all tags
        const tags = await Promise.all(
            uniqueTagNames.map(name => this.findOrCreate(name))
        );

        // Get current tags for this item
        const currentTags = await ItemTag.findAll({ where: { itemId } });
        const currentTagIds = currentTags.map(it => it.tagId);
        const newTagIds = tags.map(t => t.id);

        // Remove old associations
        await ItemTag.destroy({
            where: {
                itemId,
                tagId: { [Op.notIn]: newTagIds },
            },
        });

        // Add new associations (only if not exists)
        for (const tag of tags) {
            await ItemTag.findOrCreate({
                where: { itemId, tagId: tag.id },
            });
        }

        // Update usage counts
        await this.updateUsageCounts();

        return tags;
    }

    // Recalculate usage count for all tags
    static async updateUsageCounts(): Promise<void> {
        const tags = await Tag.findAll();

        for (const tag of tags) {
            const count = await ItemTag.count({ where: { tagId: tag.id } });
            await tag.update({ usageCount: count });
        }
    }

    // Get popular tags
    static async getPopular(limit: number = 20): Promise<Tag[]> {
        return Tag.findAll({
            where: {
                usageCount: { [Op.gt]: 0 },
            },
            order: [['usageCount', 'DESC']],
            limit,
        });
    }

    // Search tags by name
    static async search(query: string, limit: number = 50): Promise<Tag[]> {
        return Tag.findAll({
            where: {
                name: {
                    [Op.like]: `%${query.toLowerCase()}%`,
                },
            },
            order: [['usageCount', 'DESC']],
            limit,
        });
    }

    // Get all tags
    static async getAll(limit: number = 100): Promise<Tag[]> {
        return Tag.findAll({
            order: [['usageCount', 'DESC']],
            limit,
        });
    }

    // Get items by tag slug
    static async getItemsByTag(tagSlug: string): Promise<any> {
        const tag = await Tag.findOne({ where: { slug: tagSlug } });
        
        if (!tag) {
            throw new Error('Tag not found');
        }

        const itemTags = await ItemTag.findAll({
            where: { tagId: tag.id },
        });

        const itemIds = itemTags.map(it => it.itemId);

        const items = await Item.findAll({
            where: { id: { [Op.in]: itemIds } },
            include: ['author', 'comments'],
        });

        return {
            tag,
            items,
            count: items.length,
        };
    }

    // Get tags for a specific item
    static async getItemTags(itemId: string): Promise<Tag[]> {
        const itemTags = await ItemTag.findAll({
            where: { itemId },
        });

        const tagIds = itemTags.map(it => it.tagId);

        return Tag.findAll({
            where: { id: { [Op.in]: tagIds } },
            order: [['name', 'ASC']],
        });
    }
}
