import QRCode from "qrcode";

export async function generateQRCode(text: string): Promise<string> {
  try {
    return await QRCode.toDataURL(text);
  } catch (error) {
    console.error("Erreur lors de la génération du QR code:", error);
    throw error;
  }
}
