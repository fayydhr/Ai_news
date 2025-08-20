const apis = [
  `https://newsapi.org/v2/everything?q=artificial%20intelligence&language=en&sortBy=publishedAt&pageSize=20&apiKey=45147fd08062419892eeea8d7f6923ce`,
  `https://api.thenewsapi.com/v1/news/all?api_token=HZmiWRxZqri1ojwz2V9oh9K80UWziQgSObLUD0IW&search=artificial+intelligence&language=en&limit=20&sort=published_at:desc`,
  `https://gnews.io/api/v4/search?q=artificial%20intelligence&token=9cf3d3499e8cc2c52ef72f3f2aa3e431&max=20`
];

let allArticles = [];
let currentPage = 1;
const articlesPerPage = 8;

async function fetchNews() {
  try {
    const results = await Promise.all(apis.map(url => fetch(url).then(r => r.json())));
    const formatted = [];

    // NewsAPI.org
    if (results[0].articles) results[0].articles.forEach(a => {
      if(a.title.toLowerCase().includes('artificial intelligence') || (a.description && a.description.toLowerCase().includes('artificial intelligence'))){
        formatted.push({title:a.title,url:a.url,publishedAt:a.publishedAt,image:a.urlToImage||'https://via.placeholder.com/400x200?text=No+Image',views:Math.floor(Math.random()*1000),source:a.source.name||'NewsAPI.org'});
      }
    });

    // TheNewsAPI
    if (results[1].data) results[1].data.forEach(a => {
      if(a.title.toLowerCase().includes('artificial intelligence') || (a.description && a.description.toLowerCase().includes('artificial intelligence'))){
        formatted.push({title:a.title,url:a.url,publishedAt:a.published_at,image:a.image_url||'https://via.placeholder.com/400x200?text=No+Image',views:Math.floor(Math.random()*1000),source:a.source|| (new URL(a.url)).hostname});
      }
    });

    // GNews
    if (results[2].articles) results[2].articles.forEach(a => {
      if(a.title.toLowerCase().includes('artificial intelligence') || (a.description && a.description.toLowerCase().includes('artificial intelligence'))){
        formatted.push({title:a.title,url:a.url,publishedAt:a.publishedAt,image:a.image||'https://via.placeholder.com/400x200?text=No+Image',views:Math.floor(Math.random()*1000),source:a.source.name||'GNews'});
      }
    });

    allArticles = formatted.sort((a,b)=> new Date(b.publishedAt)-new Date(a.publishedAt));
    renderMostViewed(allArticles);
    renderPage(currentPage);

  } catch(err) {
    console.error(err);
    document.getElementById('newsContainer').innerHTML = "<p>Failed to load news. Check API keys.</p>";
  }
}

function createCard(article,isMostViewed=false){
  const sourceHTML = `<div class="source">Source: ${article.source}</div>`;
  if(isMostViewed){
    const card=document.createElement('div'); 
    card.className='most-viewed-card';
    card.innerHTML=`<div class="badge">Most Viewed</div>
                    <img src="${article.image}" alt="News Image">
                    <div class="most-viewed-card-content">
                      <a href="${article.url}" target="_blank">${article.title}</a>
                      ${sourceHTML}
                      <div class="timestamp">${new Date(article.publishedAt).toLocaleString()}</div>
                    </div>`;
    return card;
  } else {
    const card=document.createElement('div'); 
    card.className='news-card';
    card.innerHTML=`<img src="${article.image}" alt="News Image">
                    <div class="news-card-content">
                      <a href="${article.url}" target="_blank">${article.title}</a>
                      ${sourceHTML}
                      <div class="timestamp">${new Date(article.publishedAt).toLocaleString()}</div>
                    </div>`;
    return card;
  }
}

function renderMostViewed(articles){
  const container=document.getElementById('mostViewedContainer'); 
  container.innerHTML='';
  if(articles.length>0){
    const topArticle=articles.sort((a,b)=>b.views-a.views)[0];
    container.appendChild(createCard(topArticle,true));
  }
}

function renderPage(page){
  const container=document.getElementById('newsContainer'); 
  container.innerHTML='';
  const start=(page-1)*articlesPerPage; 
  const end=start+articlesPerPage;
  allArticles.slice(start,end).forEach(a=>container.appendChild(createCard(a)));
  const totalPages=Math.ceil(allArticles.length/articlesPerPage);
  const pagination=document.getElementById('pagination'); 
  pagination.innerHTML='';
  for(let i=1;i<=totalPages;i++){
    const btn=document.createElement('button'); 
    btn.textContent=i;
    if(i===page) btn.classList.add('active');
    btn.onclick=()=>{currentPage=i; renderPage(i);};
    pagination.appendChild(btn);
  }
}

document.getElementById('searchInput').addEventListener('input',e=>{
  const keyword=e.target.value.toLowerCase();
  const filtered=allArticles.filter(a=>a.title.toLowerCase().includes(keyword));
  currentPage=1;
  const container=document.getElementById('newsContainer'); 
  container.innerHTML='';
  const pagination=document.getElementById('pagination'); 
  pagination.innerHTML='';
  if(filtered.length>0){ 
    filtered.slice(0,articlesPerPage).forEach(a=>container.appendChild(createCard(a))); 
  }
  else { container.innerHTML='<p style="padding:20px;">No news found.</p>'; }
});

fetchNews();
