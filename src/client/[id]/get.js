export default async function Client ({ endJson, keys }) {
    const { id } = await keys;
    return endJson ({ status:201, data:`This is RoxterJS id: ${id}`});
}