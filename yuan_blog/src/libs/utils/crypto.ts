import request from '@/libs/request';

/**
 * RSA 加密工具类
 * 动态从后端获取公钥，避免硬编码
 */

let cachedPublicKey: string | null = null;
let fetchingPromise: Promise<string | null> | null = null;

/**
 * 从后端获取公钥
 * 使用项目统一的 request 工具
 */
async function fetchPublicKey(): Promise<string | null> {
  if (cachedPublicKey) return cachedPublicKey;
  if (fetchingPromise) return fetchingPromise;

  fetchingPromise = request<any>({
    method: 'GET',
    url: '/admin/pubkey',
  })
    .then((res) => {
      // 遵循项目 request.ts 的响应拦截逻辑
      // 如果 code 为 200，res.data 应该包含了公钥字符串
      if (res && res.data) {
        cachedPublicKey = res.data;
        return cachedPublicKey;
      }
      throw new Error("Failed to fetch public key: Invalid response format");
    })
    .catch((err) => {
      console.error("Fetch Public Key Error:", err);
      return null;
    })
    .finally(() => {
      fetchingPromise = null;
    });

  return fetchingPromise;
}

/**
 * 将 PEM 格式的公钥转换为 CryptoKey 对象
 */
async function importPublicKey(pem: string) {
  const pemHeader = "-----BEGIN PUBLIC KEY-----";
  const pemFooter = "-----END PUBLIC KEY-----";
  
  const pemContents = pem
    .replace(pemHeader, "")
    .replace(pemFooter, "")
    .replace(/\s/g, "");
  
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
    const publicKeyStr = await fetchPublicKey();
    if (!publicKeyStr) {
      return false;
    }

    const publicKey = await importPublicKey(publicKeyStr);
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
