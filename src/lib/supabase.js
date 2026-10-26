// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js';
// 優先讀取 Vite 格式，若無則防護
const supabaseUrl = 
  import.meta.env.VITE_SUPABASE_URL || 
  import.meta.env.SUPABASE_URL || 
  '';

const supabaseAnonKey = 
  import.meta.env.VITE_SUPABASE_ANON_KEY || 
  import.meta.env.SUPABASE_ANON_KEY || 
  '';

// 防護機制：只有當網址與 Key 均存在時才初始化
export const supabase = (supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http'))
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// PDF 上傳至 Supabase Storage
export const uploadPdfToCloud = async (file) => {
  if (!supabase) return { fileUrl: '', storagePath: '' };

  const fileId = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
  const filePath = `notes/${fileId}`;

  const { data, error } = await supabase.storage
    .from('pdf_files')
    .upload(filePath, file, { cacheControl: '3600', upsert: true });

  if (error) throw error;

  const { data: publicUrlData } = supabase.storage
    .from('pdf_files')
    .getPublicUrl(filePath);

  return {
    fileUrl: publicUrlData.publicUrl,
    storagePath: filePath
  };
};

// 刪除 Supabase Storage 上的 PDF 檔案 \\
export const deletePdfFromCloud = async (storagePath) => {
  if (!supabase || !storagePath) return;
  const { error } = await supabase.storage
    .from('pdf_files')
    .remove([storagePath]);
  if (error) console.warn('Supabase PDF 刪除警告:', error);
};