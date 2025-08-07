import { useEffect } from 'react';

export function Banner() {
    useEffect(() => {
    const d = document;
    const s = d.createElement('script');
    const l = d.scripts[d.scripts.length - 1];

    // Aqui você pode passar configurações se necessário
    (s as any).settings = {}; // "as any" é usado para evitar erro de tipo

    s.src = "//probableregret.com/bwXOV.stdhGEl-0GYbWBch/teZmk9AuQZLUblpkOPlTkYr1kNsjuk/0zN/jGcbtYNYj/Uf2MOmThQV2MOgAC";
    s.async = true;
    s.referrerPolicy = 'no-referrer-when-downgrade';

    l.parentNode?.insertBefore(s, l);

    // Cleanup se necessário
    return () => {
      s.remove();
    };
  }, []);

  return null; // ✅ Precisa retornar algo (null = não renderiza nada)
}
