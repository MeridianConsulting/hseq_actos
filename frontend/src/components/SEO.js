import React from 'react';

/**
 * Componente SEO simple basado en document.title y meta tags.
 * Si no quieres dependencias adicionales, usamos efectos nativos.
 */
export default function SEO({
  title = 'Meridian HSEQ',
  description = 'Plataforma HSEQ para reportes y gestión de hallazgos, incidentes y conversaciones.',
  url = 'https://hseq.meridianltda.com/',
  image = 'https://hseq.meridianltda.com/logo512.png',
  keywords = 'HSEQ, seguridad industrial, reportes, incidentes, hallazgos',
}) {
  React.useEffect(() => {
    if (title) document.title = title;
    const setMeta = (name, content) => {
      if (!content) return;
      let el = document.querySelector(`meta[name="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('name', name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };
    const setOG = (property, content) => {
      if (!content) return;
      let el = document.querySelector(`meta[property="${property}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('property', property);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMeta('description', description);
    setMeta('keywords', keywords);
    setMeta('robots', 'index,follow');

    setOG('og:type', 'website');
    setOG('og:title', title);
    setOG('og:description', description);
    setOG('og:url', url);
    setOG('og:image', image);

    // Twitter
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', title);
    setMeta('twitter:description', description);
    setMeta('twitter:image', image);
  }, [title, description, url, image, keywords]);

  return null;
}



