import { apply_filters } from './wp-hooks';

/**
 * Simulador do Template Hierarchy do WordPress
 * Identifica qual arquivo base ("theme template") deve ser carregado
 * baseado no contexto (slug, type, isArchive).
 */

type WPContext = {
  isArchive?: boolean;
  isSingle?: boolean;
  postType?: string;
  slug?: string;
};

export function resolveTemplate(context: WPContext): string {
  let template = 'index'; // fallback default

  if (context.isSingle && context.postType) {
    // Tenta carregar single-$posttype. Se não achar, cairá no single.
    template = `single-${context.postType}`;
  } else if (context.isSingle) {
    template = 'single';
  } else if (context.isArchive && context.postType) {
    template = `archive-${context.postType}`;
  } else if (context.isArchive) {
    template = 'archive';
  }

  // Permite que "plugins" alterem o template final via hooks, exatamente como o template_include filter do WP.
  return apply_filters('template_include', template, context);
}
