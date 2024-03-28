export const Body = async (req) => {
  try{
      let cks = '';
      for await (const chunk of req) cks += await chunk.toString(); 
      return (typeof cks !== "string") ? cks || '{}' : JSON.parse(cks);
  }
  catch {
      return null
  }
};