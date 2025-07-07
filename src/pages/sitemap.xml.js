// src/pages/sitemap.xml.js

import apiClient from '@/api/axios';

const SITE_URL = 'https://www.casa-moreno.com';

function generateSiteMap(products, categories) {
    return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <url>
       <loc>${SITE_URL}</loc>
     </url>
     <url>
       <loc>${SITE_URL}/offers</loc>
     </url>
     <url>
       <loc>${SITE_URL}/info/about-us</loc>
     </url>
     <url>
       <loc>${SITE_URL}/info/privacy-policy</loc>
     </url>
      <url>
       <loc>${SITE_URL}/info/terms-of-use</loc>
     </url>

     ${categories
            .map((category) => {
                return `
       <url>
           <loc>${`${SITE_URL}/products/${category.toLowerCase()}`}</loc>
       </url>
     `;
            })
            .join('')}

     ${products
            .map(({ productId }) => {
                return `
       <url>
           <loc>${`${SITE_URL}/product/${productId}`}</loc>
       </url>
     `;
            })
            .join('')}
   </urlset>
 `;
}

function SiteMap() {
    // getServerSideProps irá gerar o sitemap
}

export async function getServerSideProps({ res }) {
    try {
        // Busca todos os produtos e categorias da sua API
        const [productsRes, categoriesRes] = await Promise.all([
            apiClient.get('/products/list-all'),
            apiClient.get('/products/categories')
        ]);

        const sitemap = generateSiteMap(productsRes.data, categoriesRes.data);

        res.setHeader('Content-Type', 'text/xml');
        res.write(sitemap);
        res.end();

        return {
            props: {},
        };

    } catch (error) {
        console.error("Erro ao gerar sitemap:", error);
        res.statusCode = 500;
        res.end();
        return { props: {} };
    }
}

export default SiteMap;