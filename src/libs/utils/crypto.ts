// 后端生成的公钥字符串
const PEM_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwO8kcHzVf9cfhvkzzVHk
Es7xgG5qw20EtRPLo06w/UyR6VZnV8319REbVRZjn4jVuqnsAchx3j7hpMoxjuoO
6jb0y8OI0D0FIZyytqgaDU2YpLr79YVi4q2VtaBISNbQJYCjVzRYUB0djZUIFMej
/ymN2GH3Nf527C4EXR479Zu2UcyQCQH5l6v/NK0J+J6s48z5wN8cZPqEcrcP/CnB
nzuHfq7Pg6oabIvfgSIL93WxgkyB4HcxMMr6ULPeMhQDPyUXRS8hJsKIwGWEXIQU
0BukFglO0VtwUbNQ9IBJ5U/EJVqgk70+5yLW/WlGzav2Q45MtGUomY8KM8XitfoD
zwIDAQAB
-----END PUBLIC KEY-----`;

/**
 * 将 PEM 格式的公钥转换为 CryptoKey 对象
 */
async function importPublicKey(pem: string) {
  const pemHeader = "-----BEGIN PUBLIC KEY-----";
  const pemFooter = "-----END PUBLIC KEY-----";
  const pemContents = pem.substring(
    pemHeader.length,
    pem.length - pemFooter.length
  ).replace(/\s/g, "");
  
  const binaryDerString = window.atob(pemContents);
  const binaryDer = new Uint8Array(binaryDerString.length);
  for (let i = 0; i < binaryDerString.length; i++) {
    binaryDer[i] = binaryDerString.charCodeAt(i);
  }

  return window.crypto.subtle.importKey(
    "spki",
    binaryDer.buffer,
    {
      name: "RSA-OAEP",
      hash: "SHA-256",
    },
    true,
    ["encrypt"]
  );
}

/**
 * 数组转 Base64 字符串
 */
function arrayBufferToBase64(buffer: ArrayBuffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

/**
 * RSA-OAEP-SHA256 加密
 * @param data 明文
 */
export const encrypt = async (data: string): Promise<string | false> => {
  try {
    const publicKey = await importPublicKey(PEM_PUBLIC_KEY);
    const encodedData = new TextEncoder().encode(data);
    const encryptedBuffer = await window.crypto.subtle.encrypt(
      {
        name: "RSA-OAEP"
      },
      publicKey,
      encodedData
    );
    return arrayBufferToBase64(encryptedBuffer);
  } catch (err) {
    console.error("Encryption error:", err);
    return false;
  }
};
