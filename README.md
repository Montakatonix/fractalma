# FRACTALMA — Landing Page

Landing page premium para el método FRACTALMA.

**Stack:** Next.js 15 · TypeScript · Tailwind CSS · Supabase · Vercel

---

## Configuración local

```bash
git clone <repo-url>
cd fractalma
npm install

# Crear archivo de variables de entorno
cp .env.example .env.local
# Rellenar las variables (ver sección abajo)

npm run dev
```

Abre http://localhost:3000

---

## Variables de entorno

```env
NEXT_PUBLIC_SUPABASE_URL=https://gkhltenzphhrpxihxbfp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon_key>
NEXT_PUBLIC_WHATSAPP_URL=https://wa.me/34XXXXXXXXX?text=...
```

---

## Supabase

Proyecto: `fractalma` · ID: `gkhltenzphhrpxihxbfp` · Región: `eu-west-3`

Tablas creadas:
- **leads** — captura de contactos (name, email, phone, source, status)
- **questionnaire_submissions** — respuestas del cuestionario previo
- **optional_testimonials** — testimonios futuros (is_published controla visibilidad)
- **site_settings** — configuración de marca (WhatsApp URL, Instagram, etc.)

Para ver los datos: https://supabase.com/dashboard/project/gkhltenzphhrpxihxbfp

---

## Despliegue en Vercel

```bash
npm i -g vercel
vercel login
vercel --prod
```

Añadir en Vercel Dashboard → Settings → Environment Variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_WHATSAPP_URL`

---

## Estructura del proyecto

```
app/
  layout.tsx        # Metadata SEO, Open Graph, fuentes
  page.tsx          # Landing completa (todas las secciones)
  globals.css       # CSS variables del sistema de diseño
lib/
  supabase.ts       # Cliente Supabase + tipos
public/
  favicon.svg
```

---

## Secciones de la landing

1. **Hero** — Titular + subtítulo + CTA WhatsApp + CTA cuestionario
2. **Si esto te resuena** — 6 patrones de identificación
3. **El problema real** — Origen interno de los patrones
4. **Qué es FRACTALMA** — Concepto fractal + alma + lema
5. **Las 3 fases** — Despertar / Liberar / Reconectar
6. **El acompañamiento** — Cómo funciona + herramientas
7. **Diferencial** — Qué lo distingue
8. **Testimonios** — Placeholder para Supabase (optional_testimonials)
9. **FAQ** — 5 objeciones principales
10. **Cuestionario** — Formulario 3 pasos, guarda en Supabase
11. **CTA final** — "Si se repite, no es casualidad. Es información."
12. **Footer** — Marca + links legales

---

## Sistema de diseño

- **Fondo:** `#0c0b09` (negro cálido)
- **Superficies:** `#1a1712`
- **Acento:** `#c9a96e` (oro terroso)
- **Tipografía display:** Cormorant Garamond (serif elegante)
- **Tipografía texto:** DM Sans (sans legible)

---

## Pendiente para producción

- [ ] Actualizar `NEXT_PUBLIC_WHATSAPP_URL` con el número real
- [ ] Completar páginas legales (privacidad, aviso legal, cookies)
- [ ] Conectar dominio propio en Vercel
- [ ] Activar testimonios reales desde Supabase (is_published = true)
- [ ] Configurar email de notificación cuando llega un lead (Supabase Edge Function o webhook)
- [ ] Google Analytics / Plausible si se desea tracking
