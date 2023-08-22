export default async function Client ({ json, keys }) {
    const { id } = await keys;
    return json({ status:201, data:`Roxter ID: ${id}`});
}