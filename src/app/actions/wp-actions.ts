"use server";

import pool from '@/lib/db';
import { do_action } from '@/lib/wp-hooks';

export async function getPosts(postType = 'podcast') {
  const [rows] = await pool.query('SELECT * FROM wp_posts WHERE post_type = ? ORDER BY post_date DESC', [postType]);
  return rows as any[];
}

export async function getPost(id: number) {
  const [postRows]: any = await pool.query('SELECT * FROM wp_posts WHERE ID = ?', [id]);
  if (postRows.length === 0) return null;

  const [metaRows]: any = await pool.query('SELECT meta_key, meta_value FROM wp_postmeta WHERE post_id = ?', [id]);
  
  const post = postRows[0];
  const meta: Record<string, string> = {};
  metaRows.forEach((row: any) => {
    meta[row.meta_key] = row.meta_value;
  });

  return { ...post, meta };
}

export async function savePost(payload: any) {
  const { id, title, content, status, type = 'podcast', meta } = payload;

  let postId = id;

  if (postId) {
    await pool.query(
      'UPDATE wp_posts SET post_title = ?, post_content = ?, post_status = ? WHERE ID = ?',
      [title, content, status, postId]
    );
  } else {
    const [result]: any = await pool.query(
      'INSERT INTO wp_posts (post_title, post_content, post_status, post_type) VALUES (?, ?, ?, ?)',
      [title, content, status, type]
    );
    postId = result.insertId;
  }

  // Handle Meta (wp_postmeta)
  if (meta) {
    for (const [key, value] of Object.entries(meta)) {
      // Check if meta exists
      const [existing]: any = await pool.query('SELECT meta_id FROM wp_postmeta WHERE post_id = ? AND meta_key = ?', [postId, key]);
      
      if (existing.length > 0) {
        await pool.query('UPDATE wp_postmeta SET meta_value = ? WHERE meta_id = ?', [value, existing[0].meta_id]);
      } else {
        await pool.query('INSERT INTO wp_postmeta (post_id, meta_key, meta_value) VALUES (?, ?, ?)', [postId, key, value]);
      }
    }
  }

  // Trigger WP hook
  await do_action('save_post', postId, payload);

  return postId;
}

export async function deletePost(id: number) {
  await pool.query('DELETE FROM wp_posts WHERE ID = ?', [id]);
  await pool.query('DELETE FROM wp_postmeta WHERE post_id = ?', [id]);
  await do_action('delete_post', id);
  return true;
}

export async function getDashboardStats() {
  const [postRows]: any = await pool.query('SELECT ID, post_date FROM wp_posts WHERE post_type = "podcast"');
  const [metaRows]: any = await pool.query('SELECT meta_value FROM wp_postmeta WHERE meta_key = "duration"');
  
  let totalMinutes = 0;
  metaRows.forEach((row: any) => {
    if (row.meta_value) {
      const parts = row.meta_value.split(':').map(Number);
      if (parts.length === 2) totalMinutes += parts[0];
      else if (parts.length === 3) totalMinutes += (parts[0] * 60) + parts[1];
      else if (parts.length === 1) totalMinutes += parts[0];
    }
  });

  return {
    totalEpisodes: postRows.length,
    totalMinutes,
    recentComments: [] // Stub for now, can be added later as wp_comments
  };
}
