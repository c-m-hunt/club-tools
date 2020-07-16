export const base64Encode = (data: string): string => {
    const buf = Buffer.from(data);
    return buf.toString("base64");
};