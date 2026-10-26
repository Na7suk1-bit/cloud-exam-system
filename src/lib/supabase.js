// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 
  import.meta.env.VITE_SUPABASE_URL || 
  import.meta.env.SUPABASE_URL || 
  '';

const supabaseAnonKey = 
  import.meta.env.VITE_SUPABASE_ANON_KEY || 
  import.meta.env.SUPABASE_ANON_KEY || 
  '';

// 防護重點：嚴格檢查 URL 格式，避免金鑰缺失拋錯導致全頁白畫面
let client = null;
if (supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http')) {
  try {
    client = createClient(supabaseUrl, supabaseAnonKey);
  } catch (e) {
    console.warn('Supabase 連線失敗，自動降級至單機快取模式:', e);
  }
}

export const supabase = client;

// PDF 檔案上傳至 Supabase Storage (Bucket: pdf_files)
export const uploadPdfToCloud = async (file) => {
  if (!supabase) return { fileUrl: '', storagePath: '' };
  try {
    const fileId = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
    const filePath = `notes/${fileId}`;

    const { error } = await supabase.storage
      .from('pdf_files')
      .upload(filePath, file, { cacheControl: '3600', upsert: true });

    if (error) throw error;

    const { data: publicUrlData } = supabase.storage
      .from('pdf_files')
      .getPublicUrl(filePath);

    return { fileUrl: publicUrlData.publicUrl, storagePath: filePath };
  } catch (e) {
    console.error('PDF 上傳失敗:', e);
    return { fileUrl: '', storagePath: '' };
  }
};

// 刪除 Supabase Storage 上的 PDF 檔案
export const deletePdfFromCloud = async (storagePath) => {
  if (!supabase || !storagePath) return;
  try {
    await supabase.storage.from('pdf_files').remove([storagePath]);
  } catch (e) {
    console.warn('Supabase PDF 刪除警告:', e);
  }
};