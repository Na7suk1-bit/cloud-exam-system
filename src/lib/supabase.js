import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// PDF 檔案上傳至 Supabase Storage (Bucket: pdf_files)
export const uploadPdfToCloud = async (file) => {
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

// 刪除 Supabase Storage 上的 PDF 檔案
export const deletePdfFromCloud = async (storagePath) => {
  if (!storagePath) return;
  const { error } = await supabase.storage
    .from('pdf_files')
    .remove([storagePath]);
  if (error) console.warn('Supabase PDF 刪除警告:', error);
};