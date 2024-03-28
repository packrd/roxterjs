export const Body = async (req) => {
  try {
    let cks = '';
    for await (const chunk of req) {
      cks += await chunk.toString(); 
    }
    if (!cks.trim()) {
      return {}; 
    }
    return JSON.parse(cks);
  } catch (error) {
    return {}
  }
};
