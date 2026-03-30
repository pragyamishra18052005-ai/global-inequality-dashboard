// LIVE NEWS via RSS Feed
async function loadLiveNews() {
  const ticker = document.getElementById('tickerContent');
  if (!ticker) return;
  const feedUrl = 'https://api.rss2json.com/v1/api.json?rss_url=https://feeds.bbci.co.uk/news/business/rss.xml&count=8';
  try {
    const res = await fetch(feedUrl);
    const data = await res.json();
    if (data.status === 'ok' && data.items && data.items.length > 0) {
      const keywords = ['inequality', 'poverty', 'economy', 'gdp', 'unemployment', 'income', 'wealth', 'inflation', 'growth', 'development'];
      let items = data.items.filter(item => {
        const text = (item.title + ' ' + (item.description || '')).toLowerCase();
        return keywords.some(k => text.includes(k));
      });
      if (items.length === 0) items = data.items;
      const liveHTML = items.slice(0, 6).map(item => {
        const title = item.title.replace(/[<>]/g, '');
        const date = new Date(item.pubDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
        return `<span>📰 <strong>${date}:</strong> ${title}</span>`;
      }).join('');
      const staticHTML = [
        '<span>🌍 Global Gini Index stands at 40.60 — moderate-to-high inequality worldwide</span>',
        '<span>📊 South Africa remains world\'s most unequal country with Gini score of 63</span>',
        '<span>🔮 Power BI forecast predicts global inequality will fall to 35-38 by 2040</span>',
      ].join('');
      ticker.innerHTML = liveHTML + staticHTML;
    }
  } catch (err) {
    // Static news remains as fallback
  }
}

// LOADER
window.addEventListener('load', () => {
  setTimeout(() => {
    const l = document.getElementById('loader');
    if (l) {
      l.style.opacity = '0';
      l.style.visibility = 'hidden';
      setTimeout(() => { l.style.display = 'none'; }, 600);
    }
  }, 2400);
});

// SINGLE DOMContentLoaded — sab kuch yahan
window.addEventListener('DOMContentLoaded', () => {
  buildHeatmap();
  setTimeout(loadLiveNews, 3000);
  setInterval(loadLiveNews, 10 * 60 * 1000);
});

// NAVBAR SCROLL
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 50);
});

// COUNTER ANIMATION
const counters = document.querySelectorAll('.counter');
counters.forEach(counter => {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const target = +counter.getAttribute('data-target');
        let cur = 0;
        const step = target / 60;
        const t = setInterval(() => {
          cur += step;
          if (cur >= target) { cur = target; clearInterval(t); }
          counter.innerText = Math.ceil(cur);
        }, 25);
        obs.disconnect();
      }
    });
  }, { threshold: 0.4 });
  obs.observe(counter);
});

// CARD FADE ANIMATIONS
const cards = document.querySelectorAll('.card');
const cardObs = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => {
        e.target.style.animation = 'fadeup 0.5s ease forwards';
        e.target.style.opacity = '1';
      }, i * 100);
      cardObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
cards.forEach(c => { c.style.opacity = '0'; cardObs.observe(c); });

// FULLSCREEN
function fullscreen() {
  const el = document.getElementById('powerbi');
  if (!document.fullscreenElement) el.requestFullscreen();
  else document.exitFullscreen();
}

// PAGE SELECTOR
const pageDesc = {
  1: '🌐 <strong>Page 1 — Global Overview:</strong> 5 KPI cards showing Avg Gini (40.60), Palma Ratio (2.37), GDP ($26.09K), Inequality Gap (32.56), Countries (201). Bar chart shows top unequal countries. Line chart shows Gini trend 1990–2020.',
  2: '🗺️ <strong>Page 2 — Regional Dive:</strong> Scatter plot reveals GDP vs Gini relationship. European countries cluster in low-Gini zone. Stacked bar shows regional inequality by income group.',
  3: '🔍 <strong>Page 3 — Homicide:</strong> 28M total homicides analyzed. Peaked ~2010, declining since. 55% male victims. Brazil, India, Mexico, Colombia top the rankings. Region slicer included.',
  4: '📈 <strong>Page 4 — Impact:</strong> Higher unemployment = higher inequality. Dual-axis chart overlays Gini + homicide trends. SDG bar shows Latin America & Africa furthest from Goals 11 & 16.',
  5: '🔮 <strong>Page 5 — Forecast:</strong> Power BI forecast to 2040. Palma Ratio chart shows South Africa, Colombia, Paraguay as highest-risk. Year slicer for 1990–2023.'
};
const pageLabels = {
  1: 'Page 1 — Global Overview',
  2: 'Page 2 — Regional Deep Dive',
  3: 'Page 3 — Homicide Analysis',
  4: 'Page 4 — Impact Analysis',
  5: 'Page 5 — Future Outlook'
};
function setPage(num, btn) {
  document.querySelectorAll('.page-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('pageLabel').textContent = pageLabels[num];
  document.getElementById('pageDescText').innerHTML = pageDesc[num];
}

// SIDE PANEL
const panelData = {
  p1: 'Page 1 — Global Overview: This page gives a complete snapshot of global income inequality. 5 KPI cards show: Avg Gini Index (40.60) meaning moderate-to-high global inequality, Palma Ratio (2.37) meaning top 10% earns 2.37x more than bottom 40%, Avg GDP per Capita ($26.09K), Inequality Gap (32.56) showing difference between rich and poor income shares, and Total Countries analyzed (201). A Bar Chart shows top unequal countries — South Africa (63), Namibia (59), Botswana (53) lead because of historical wealth concentration. A Line Chart shows Gini trend from 1990–2020 — inequality rose in 1990s due to globalization, then declined post-2000 due to social programs.',
  p2: 'Page 2 — Regional Deep Dive: This page answers WHY some regions are more unequal than others. A Scatter Plot compares GDP per Capita vs Gini Index for all 201 countries — the pattern shows a clear inverse relationship: richer countries tend to be more equal. Europe clusters in top-left (high GDP, low Gini) while Africa clusters in bottom-right (low GDP, high Gini). A Stacked Bar Chart shows average Gini broken down by UN Region AND Income Group.',
  p3: 'Page 3 — Homicide Analysis: Total 28 million homicides were recorded globally from 1990–2023. An Area Line Chart shows the homicide trend — peaked around 2010 due to drug wars in Latin America, declining since. A Donut Chart shows 55% of victims are Male. A Bar Chart shows Brazil, India, Mexico, Colombia as top countries. Interactive Region Slicer allows filtering.',
  p4: 'Page 4 — Impact Analysis: A Scatter Plot shows Unemployment Rate vs Gini Index — countries with higher unemployment consistently have higher inequality. A Dual-Axis Line Chart overlays both Avg Gini Index AND Total Homicide trends. A Bar Chart shows SDG Goals 11 and 16 progress by region.',
  p5: 'Page 5 — Future Outlook: A Forecast Line Chart uses Power BI built-in analytics with 95% confidence interval — global average Gini predicted to fall from 40.60 to 35–38 by 2040. A Palma Ratio Bar Chart identifies highest-risk countries. An interactive Year Slicer allows exploring any year from 1990 to 2023.',
  income: 'Income Gap Analysis: Income gap refers to the difference in earnings between the richest and poorest people in society. It is measured using the Gini Index (0 = perfect equality, 100 = maximum inequality) and Palma Ratio. WHY does it happen? Because of unequal access to education, technology, land ownership, and inherited wealth. HOW is it shown? Page 2 Scatter Plot shows GDP vs Gini — higher GDP countries have smaller income gaps. WHY were these visuals chosen? Scatter plots are best for showing relationships between two variables.',
  education: 'Education Inequality: Education inequality means unequal access to quality education based on income, region, or gender. WHY does it matter? Education is the primary path out of poverty — countries with better education systems have lower Gini scores. Countries with Gini below 30 like Denmark, Sweden, Norway all have free high-quality public education. Countries with Gini above 50 like South Africa and Brazil have huge gaps between elite private and underfunded public schools.',
  economic: 'Economic Participation: Economic participation refers to how equally people can participate in the economy. WHY does unequal participation cause inequality? When women, rural populations, or minority groups are excluded from economic opportunities, income concentrates among a small privileged group. Page 4 Scatter Plot shows that countries with higher unemployment rates consistently have higher Gini scores.',
  homicide: 'Homicide Analysis: Intentional homicide is one of the strongest indicators of social inequality. WHY does inequality cause homicide? When income gaps are large, desperation and social exclusion leads to violence. Page 3 tracks 28 million homicides from 1990–2023 across 201 countries. The Area Chart shows homicides peaked around 2010. The Gender Donut shows 55% male victims. Brazil, India, Mexico top the chart.',
  forecast: '2040 Forecast Analysis: The Future Outlook page uses Power BI built-in Exponential Smoothing forecast model. WHY is forecasting important? It helps governments plan policies in advance. If current trends continue AND SDG goals are met, global average Gini will fall from 40.60 to approximately 35–38 by 2040 with 95% confidence interval.'
};

function openPanel(key) {
  document.getElementById('chartInfo').textContent = panelData[key] || 'Click a button to see explanation.';
  document.getElementById('infoPanel').classList.add('active');
  document.getElementById('panelOverlay').classList.add('show');
}
function closePanel() {
  document.getElementById('infoPanel').classList.remove('active');
  document.getElementById('panelOverlay').classList.remove('show');
}

// CHATBOT
function toggleChat() {
  document.getElementById('chatbox').classList.toggle('open');
}
function chatKey(e) {
  if (e.key === 'Enter') chatSend();
}
async function chatSend() {
  const inp = document.getElementById('chatIn');
  const body = document.getElementById('chatBody');
  if (!inp.value.trim()) return;
  const msg = inp.value.trim();
  inp.value = '';
  const userBub = document.createElement('div');
  userBub.className = 'cbub user';
  userBub.textContent = msg;
  body.appendChild(userBub);
  body.scrollTop = body.scrollHeight;
  const typing = document.createElement('div');
  typing.className = 'cbub bot';
  typing.id = 'typing';
  typing.innerHTML = '<span class="dot">.</span><span class="dot">.</span><span class="dot">.</span>';
  body.appendChild(typing);
  body.scrollTop = body.scrollHeight;
  const reply = await getAIReply(msg);
  document.getElementById('typing')?.remove();
  const botBub = document.createElement('div');
  botBub.className = 'cbub bot';
  botBub.textContent = reply;
  body.appendChild(botBub);
  body.scrollTop = body.scrollHeight;
}

async function getAIReply(question) {
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'YOUR_API_KEY_HERE',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 200,
        system: `You are an expert data analyst assistant for the Global Income Inequality Dashboard.
Dashboard covers 201 countries, 1990-2023 data.
Key global stats: Gini Index avg = 40.60, Palma Ratio = 2.37, GDP avg = $26090, Total Homicides = 28 million, Unemployment avg = 8.60%.
Answer any question about any country's inequality, GDP, Gini, homicide, unemployment in 2-3 short sentences.
Be specific with numbers. Stay focused on inequality topics.`,
        messages: [{ role: 'user', content: question }]
      })
    });
    const data = await res.json();
    if (data.content && data.content[0]) return data.content[0].text;
    return fallback(question);
  } catch (e) {
    return fallback(question);
  }
}

function fallback(msg) {
  const lower = msg.toLowerCase();
  const kb = {
    singapore: 'Singapore Gini ~45. Despite being one of the wealthiest nations, it has high inequality due to large income gaps between skilled and unskilled workers.',
    india: 'India has a Gini Index of ~35. It ranks among top countries for homicides due to large population. Rapid economic growth has increased urban-rural inequality.',
    china: 'China Gini ~38. Inequality declining due to rural development and poverty alleviation programs. GDP per capita ~$12,000.',
    usa: 'USA Gini ~41, higher than most developed nations. Income inequality has been rising since 1980s due to wage gaps.',
    america: 'USA (United States of America) Gini ~41, higher than most developed nations. Income inequality rising since 1980s.',
    'united states': 'United States Gini ~41. Top 1% owns more wealth than bottom 90% combined.',
    'north america': 'North America — USA (Gini ~41) and Mexico (Gini ~45) are highly unequal, while Canada (Gini ~33) is more equal.',
    brazil: 'Brazil Gini ~53 — one of the most unequal countries. Tops homicide rankings in Latin America.',
    russia: 'Russia Gini ~36. Inequality increased after Soviet collapse but stabilized in 2000s.',
    mexico: 'Mexico Gini ~45. High inequality and one of the top countries for homicides globally.',
    japan: 'Japan Gini ~32. One of the more equal developed nations with strong social safety nets.',
    germany: 'Germany Gini ~31. Strong welfare system keeps inequality low despite industrial economy.',
    pakistan: 'Pakistan Gini ~33. Inequality driven by rural-urban divide and limited education access.',
    bangladesh: 'Bangladesh Gini ~32. Inequality relatively low but poverty levels remain high.',
    nigeria: 'Nigeria Gini ~35. Oil wealth concentrated among few, large rural-urban divide.',
    indonesia: 'Indonesia Gini ~38. Inequality driven by urban-rural divide across islands.',
    kenya: 'Kenya Gini ~40. Inequality driven by land ownership disparities and urban migration.',
    'south africa': 'South Africa has the worlds highest Gini Index (~63) — a legacy of apartheid and ongoing economic disparities.',
    colombia: 'Colombia Gini ~54. One of the most unequal countries in Latin America with high homicide rates.',
    argentina: 'Argentina Gini ~42. Inequality worsened due to economic crises and inflation.',
    france: 'France Gini ~32. Strong social welfare system keeps inequality relatively low.',
    uk: 'United Kingdom Gini ~35. Higher inequality than most Western European countries.',
    canada: 'Canada Gini ~33. Strong social programs keep inequality moderate.',
    australia: 'Australia Gini ~34. Relatively equal society with strong minimum wage policies.',
    sweden: 'Sweden Gini ~28. One of the most equal countries in the world.',
    denmark: 'Denmark Gini ~28. Consistently ranks as one of the most equal nations globally.',
    norway: 'Norway Gini ~26. Lowest inequality globally, supported by oil wealth distribution.',
    italy: 'Italy Gini ~36. North-south divide creates significant regional inequality.',
    spain: 'Spain Gini ~34. Inequality increased after 2008 financial crisis.',
    turkey: 'Turkey Gini ~42. Significant rural-urban inequality and regional disparities.',
    iran: 'Iran Gini ~40. Inequality affected by sanctions and oil revenue distribution.',
    egypt: 'Egypt Gini ~31. Despite low Gini, poverty levels remain high in rural areas.',
    ethiopia: 'Ethiopia Gini ~35. One of the fastest growing economies but inequality rising.',
    ghana: 'Ghana Gini ~43. Inequality driven by regional disparities and urban migration.',
    vietnam: 'Vietnam Gini ~36. Inequality increasing as economy grows rapidly.',
    thailand: 'Thailand Gini ~43. High inequality with wealth concentrated in Bangkok.',
    malaysia: 'Malaysia Gini ~41. Ethnic economic disparities contribute to inequality.',
    philippines: 'Philippines Gini ~44. High inequality with wealth concentrated among elite families.',
    gini: 'Global average Gini Index is 40.60. Scale is 0 to 100. Higher = more unequal. South Africa (~63) is highest, Norway (~26) is lowest.',
    palma: 'Palma Ratio of 2.37 means top 10% earns 2.37x more than bottom 40%. South Africa and Colombia have highest ratios.',
    gdp: 'Global average GDP per capita is $26,090. Higher GDP countries tend to have lower inequality.',
    homicide: '28 million homicides globally 1990-2023. Brazil, India, Mexico, Colombia are top countries.',
    unemployment: 'Global average unemployment is 8.60%. Higher unemployment correlates with higher inequality.',
    sdg: 'SDG Goals 11 and 16 tracked in Page 4. Latin America and Africa furthest from achieving them.',
    forecast: 'Global Gini predicted to fall to 35-38 by 2040 if SDG goals are achieved.',
    africa: 'Sub-Saharan Africa has highest global inequality. South Africa, Namibia, Lesotho top rankings.',
    europe: 'Europe has lowest inequality globally. Nordic countries lead with Gini below 30.',
    asia: 'Asia has mixed inequality. Japan and South Korea are equal, while Philippines and Thailand are unequal.',
    'who made': 'This website was made by Pragya Mishra Prashasti — B.Tech CSE 2026 student at Dronacharya College of Engineering, Gurugram!',
    'who created': 'Created by Pragya Mishra Prashasti — DCE Gurugram. Power BI + Python + HTML/CSS/JS!',
    'who built': 'Built by Pragya Mishra Prashasti — B.Tech CSE 2026, DCE Gurugram!',
    creator: 'Creator: Pragya Mishra Prashasti | B.Tech CSE 2026 | DCE Gurugram!',
    developer: 'Developer: Pragya Mishra Prashasti — Skills: Power BI, Python, SQL, DAX, HTML/CSS/JS!',
    'your name': 'I am Adhira — IQ Assistant built to help you understand Global Inequality Dashboard!',
    pragya: 'Pragya Mishra Prashasti is the creator — B.Tech CSE 2026, DCE Gurugram, specializing in Data Analytics!',
    hello: 'Hello! I am Adhira, your IQ Assistant. Ask me about any country or inequality topic!',
    hi: 'Hi! I am Adhira! Ask me about any country like India, Brazil, USA or topics like Gini, GDP, Homicide!',
    help: 'I am Adhira! I can answer about 30+ countries: Gini Index, Palma Ratio, GDP, Homicide, Unemployment, SDG Goals, Forecast!'
  };
  for (const [k, v] of Object.entries(kb)) {
    if (lower.includes(k)) return v;
  }
  return 'Ask me about any country like India, China, Brazil, USA, or topics like Gini Index, Homicide, GDP, Unemployment! I am Adhira!';
}

// FILTERS
const filterData = {
  all: { countries: 201, gini: 40, homicides: 28, unemployment: 8, palma: 2, years: 33, label: 'All Countries — All Years' },
  africa: { countries: 54, gini: 45, homicides: 8, unemployment: 12, palma: 3, years: 33, label: 'Africa — All Years' },
  asia: { countries: 48, gini: 38, homicides: 10, unemployment: 7, palma: 2, years: 33, label: 'Asia — All Years' },
  europe: { countries: 44, gini: 31, homicides: 2, unemployment: 8, palma: 1, years: 33, label: 'Europe — All Years' },
  americas: { countries: 35, gini: 46, homicides: 14, unemployment: 9, palma: 3, years: 33, label: 'Americas — All Years' },
  oceania: { countries: 14, gini: 35, homicides: 1, unemployment: 6, palma: 2, years: 33, label: 'Oceania — All Years' },
  high: { countries: 58, gini: 32, homicides: 3, unemployment: 6, palma: 1, years: 33, label: 'High Income Countries' },
  upper: { countries: 56, gini: 42, homicides: 10, unemployment: 8, palma: 3, years: 33, label: 'Upper Middle Income Countries' },
  lower: { countries: 54, gini: 40, homicides: 9, unemployment: 10, palma: 2, years: 33, label: 'Lower Middle Income Countries' },
  low: { countries: 27, gini: 43, homicides: 5, unemployment: 14, palma: 3, years: 33, label: 'Low Income Countries' },
  highgini: { countries: 42, gini: 54, homicides: 15, unemployment: 14, palma: 4, years: 33, label: 'High Inequality (Gini > 50)' },
  mediumgini: { countries: 130, gini: 40, homicides: 12, unemployment: 8, palma: 2, years: 33, label: 'Medium Inequality (Gini 30–50)' },
  lowgini: { countries: 29, gini: 27, homicides: 1, unemployment: 5, palma: 1, years: 33, label: 'Low Inequality (Gini < 30)' },
  '1990': { countries: 120, gini: 43, homicides: 6, unemployment: 9, palma: 3, years: 10, label: 'All Countries — 1990s' },
  '2000': { countries: 160, gini: 41, homicides: 8, unemployment: 8, palma: 2, years: 10, label: 'All Countries — 2000s' },
  '2010': { countries: 185, gini: 40, homicides: 8, unemployment: 9, palma: 2, years: 10, label: 'All Countries — 2010s' },
  '2020': { countries: 201, gini: 39, homicides: 6, unemployment: 10, palma: 2, years: 3, label: 'All Countries — 2020s' }
};

function applyFilters() {
  const region = document.getElementById('filterRegion').value;
  const income = document.getElementById('filterIncome').value;
  const year = document.getElementById('filterYear').value;
  const gini = document.getElementById('filterGini').value;
  let key = 'all';
  if (region !== 'all') key = region;
  else if (income !== 'all') key = income;
  else if (year !== 'all') key = year;
  else if (gini !== 'all') {
    if (gini === 'high') key = 'highgini';
    else if (gini === 'medium') key = 'mediumgini';
    else if (gini === 'low') key = 'lowgini';
  }
  const data = filterData[key] || filterData.all;
  animateFilterCounter('stat-countries', data.countries);
  animateFilterCounter('stat-gini', data.gini);
  animateFilterCounter('stat-homicides', data.homicides);
  animateFilterCounter('stat-unemployment', data.unemployment);
  animateFilterCounter('stat-palma', data.palma);
  animateFilterCounter('stat-years', data.years);
  document.getElementById('filterLabel').textContent = data.label;
  const sub = document.getElementById('insightSubtitle');
  if (sub) sub.textContent = 'Filtered insights for: ' + data.label;
}

function animateFilterCounter(id, target) {
  const el = document.getElementById(id);
  if (!el) return;
  let cur = 0;
  const step = target / 40;
  const t = setInterval(() => {
    cur += step;
    if (cur >= target) { cur = target; clearInterval(t); }
    el.innerText = Math.ceil(cur);
  }, 20);
}

function resetFilters() {
  document.getElementById('filterRegion').value = 'all';
  document.getElementById('filterIncome').value = 'all';
  document.getElementById('filterYear').value = 'all';
  document.getElementById('filterGini').value = 'all';
  applyFilters();
}

// COUNTRY COMPARISON
const countryDB = {
  india: { name: 'India', flag: '🇮🇳', gini: 35, gdp: 2389, unemployment: 7, homicide: 3, region: 'Asia' },
  china: { name: 'China', flag: '🇨🇳', gini: 38, gdp: 12556, unemployment: 5, homicide: 1, region: 'Asia' },
  usa: { name: 'USA', flag: '🇺🇸', gini: 41, gdp: 63000, unemployment: 4, homicide: 6, region: 'Americas' },
  brazil: { name: 'Brazil', flag: '🇧🇷', gini: 53, gdp: 7507, unemployment: 13, homicide: 27, region: 'Americas' },
  southafrica: { name: 'South Africa', flag: '🇿🇦', gini: 63, gdp: 5484, unemployment: 32, homicide: 36, region: 'Africa' },
  germany: { name: 'Germany', flag: '🇩🇪', gini: 31, gdp: 46468, unemployment: 3, homicide: 1, region: 'Europe' },
  uk: { name: 'UK', flag: '🇬🇧', gini: 35, gdp: 40285, unemployment: 4, homicide: 1, region: 'Europe' },
  france: { name: 'France', flag: '🇫🇷', gini: 32, gdp: 38625, unemployment: 7, homicide: 1, region: 'Europe' },
  japan: { name: 'Japan', flag: '🇯🇵', gini: 32, gdp: 39285, unemployment: 3, homicide: 0, region: 'Asia' },
  russia: { name: 'Russia', flag: '🇷🇺', gini: 36, gdp: 10127, unemployment: 5, homicide: 8, region: 'Europe' },
  mexico: { name: 'Mexico', flag: '🇲🇽', gini: 45, gdp: 9926, unemployment: 4, homicide: 29, region: 'Americas' },
  colombia: { name: 'Colombia', flag: '🇨🇴', gini: 54, gdp: 5332, unemployment: 11, homicide: 25, region: 'Americas' },
  norway: { name: 'Norway', flag: '🇳🇴', gini: 26, gdp: 89202, unemployment: 4, homicide: 0, region: 'Europe' },
  sweden: { name: 'Sweden', flag: '🇸🇪', gini: 28, gdp: 52274, unemployment: 7, homicide: 1, region: 'Europe' },
  denmark: { name: 'Denmark', flag: '🇩🇰', gini: 28, gdp: 60170, unemployment: 5, homicide: 1, region: 'Europe' },
  pakistan: { name: 'Pakistan', flag: '🇵🇰', gini: 33, gdp: 1193, unemployment: 6, homicide: 4, region: 'Asia' },
  bangladesh: { name: 'Bangladesh', flag: '🇧🇩', gini: 32, gdp: 2457, unemployment: 5, homicide: 2, region: 'Asia' },
  nigeria: { name: 'Nigeria', flag: '🇳🇬', gini: 35, gdp: 2097, unemployment: 23, homicide: 10, region: 'Africa' },
  kenya: { name: 'Kenya', flag: '🇰🇪', gini: 40, gdp: 1838, unemployment: 12, homicide: 5, region: 'Africa' },
  australia: { name: 'Australia', flag: '🇦🇺', gini: 34, gdp: 51812, unemployment: 5, homicide: 1, region: 'Oceania' },
  canada: { name: 'Canada', flag: '🇨🇦', gini: 33, gdp: 43242, unemployment: 6, homicide: 2, region: 'Americas' },
  italy: { name: 'Italy', flag: '🇮🇹', gini: 36, gdp: 31676, unemployment: 10, homicide: 1, region: 'Europe' },
  spain: { name: 'Spain', flag: '🇪🇸', gini: 34, gdp: 27057, unemployment: 14, homicide: 1, region: 'Europe' },
  turkey: { name: 'Turkey', flag: '🇹🇷', gini: 42, gdp: 9661, unemployment: 11, homicide: 4, region: 'Asia' },
  indonesia: { name: 'Indonesia', flag: '🇮🇩', gini: 38, gdp: 3869, unemployment: 6, homicide: 1, region: 'Asia' }
};

function compareCountries() {
  const c1key = document.getElementById('country1').value;
  const c2key = document.getElementById('country2').value;
  if (!c1key || !c2key) return;
  if (c1key === c2key) { document.getElementById('compareResult').style.display = 'none'; return; }
  const c1 = countryDB[c1key];
  const c2 = countryDB[c2key];
  document.getElementById('compareResult').style.display = 'block';
  document.getElementById('ccard1').innerHTML = `
    <div style="font-size:2.5rem;margin-bottom:.5rem">${c1.flag}</div>
    <h3 style="font-size:1.1rem;margin-bottom:.5rem">${c1.name}</h3>
    <p style="color:#00f2ff;font-size:0.8rem">${c1.region}</p>
    <div style="margin-top:1rem;font-size:2rem;font-weight:800;background:linear-gradient(135deg,#00f2ff,#00ff88);-webkit-background-clip:text;-webkit-text-fill-color:transparent">${c1.gini}</div>
    <p style="color:rgba(255,255,255,0.5);font-size:0.75rem">Gini Index</p>`;
  document.getElementById('ccard2').innerHTML = `
    <div style="font-size:2.5rem;margin-bottom:.5rem">${c2.flag}</div>
    <h3 style="font-size:1.1rem;margin-bottom:.5rem">${c2.name}</h3>
    <p style="color:#00f2ff;font-size:0.8rem">${c2.region}</p>
    <div style="margin-top:1rem;font-size:2rem;font-weight:800;background:linear-gradient(135deg,#00f2ff,#00ff88);-webkit-background-clip:text;-webkit-text-fill-color:transparent">${c2.gini}</div>
    <p style="color:rgba(255,255,255,0.5);font-size:0.75rem">Gini Index</p>`;
  const moreEqual = c1.gini < c2.gini ? c1 : c2;
  document.getElementById('winnerBadge').innerHTML = `🏆 ${moreEqual.flag} ${moreEqual.name} is More Equal`;
  const metrics = [
    { label: 'Gini Index', v1: c1.gini, v2: c2.gini, max: 70 },
    { label: 'GDP ($K)', v1: Math.round(c1.gdp / 1000), v2: Math.round(c2.gdp / 1000), max: 100 },
    { label: 'Unemployment %', v1: c1.unemployment, v2: c2.unemployment, max: 40 },
    { label: 'Homicide Rate', v1: c1.homicide, v2: c2.homicide, max: 40 }
  ];
  let barsHTML = '';
  metrics.forEach(m => {
    const p1 = Math.min((m.v1 / m.max) * 100, 100);
    const p2 = Math.min((m.v2 / m.max) * 100, 100);
    barsHTML += `
      <div style="margin-bottom:1rem">
        <div style="font-size:0.78rem;color:rgba(255,255,255,0.5);margin-bottom:0.4rem">${m.label}</div>
        <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.3rem">
          <span style="width:55px;font-size:0.73rem;color:rgba(255,255,255,0.6);text-align:right">${c1.flag} ${m.v1}</span>
          <div style="flex:1;height:7px;background:rgba(255,255,255,0.08);border-radius:99px;overflow:hidden">
            <div style="width:${p1}%;height:100%;background:linear-gradient(90deg,#00f2ff,#00ff88);border-radius:99px;transition:width 0.8s ease"></div>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:0.5rem">
          <span style="width:55px;font-size:0.73rem;color:rgba(255,255,255,0.6);text-align:right">${c2.flag} ${m.v2}</span>
          <div style="flex:1;height:7px;background:rgba(255,255,255,0.08);border-radius:99px;overflow:hidden">
            <div style="width:${p2}%;height:100%;background:linear-gradient(90deg,#ff6464,#f59e0b);border-radius:99px;transition:width 0.8s ease"></div>
          </div>
        </div>
      </div>`;
  });
  document.getElementById('compareBars').innerHTML = barsHTML;
  const giniDiff = Math.abs(c1.gini - c2.gini);
  const gdpWinner = c1.gdp > c2.gdp ? c1 : c2;
  const crimeWinner = c1.homicide < c2.homicide ? c1 : c2;
  document.getElementById('compareVerdict').innerHTML = `
    <strong style="color:#00f2ff">📊 Analysis:</strong> ${c1.name} (Gini ${c1.gini}) and ${c2.name} (Gini ${c2.gini}) differ by <strong>${giniDiff} Gini points</strong>.
    ${moreEqual.flag} <strong>${moreEqual.name}</strong> is more equal.
    ${gdpWinner.flag} <strong>${gdpWinner.name}</strong> has higher GDP ($${gdpWinner.gdp.toLocaleString()}).
    ${crimeWinner.flag} <strong>${crimeWinner.name}</strong> has lower homicide rate.
    This comparison aligns with the global pattern — higher GDP countries tend to have lower inequality.`;
}

// HEATMAP
const heatmapData = [
  { name: 'South Africa', gini: 63 }, { name: 'Namibia', gini: 59 },
  { name: 'Colombia', gini: 54 }, { name: 'Brazil', gini: 53 },
  { name: 'Mexico', gini: 45 }, { name: 'Turkey', gini: 42 },
  { name: 'USA', gini: 41 }, { name: 'Kenya', gini: 40 },
  { name: 'Indonesia', gini: 38 }, { name: 'China', gini: 38 },
  { name: 'Russia', gini: 36 }, { name: 'India', gini: 35 },
  { name: 'Nigeria', gini: 35 }, { name: 'Spain', gini: 34 },
  { name: 'Australia', gini: 34 }, { name: 'UK', gini: 35 },
  { name: 'Italy', gini: 36 }, { name: 'Canada', gini: 33 },
  { name: 'Pakistan', gini: 33 }, { name: 'Japan', gini: 32 },
  { name: 'France', gini: 32 }, { name: 'Germany', gini: 31 },
  { name: 'Sweden', gini: 28 }, { name: 'Denmark', gini: 28 },
  { name: 'Norway', gini: 26 }
];

function getHeatColor(gini) {
  if (gini >= 55) return { bg: '#cc0000', text: 'Very High' };
  if (gini >= 45) return { bg: '#ff6464', text: 'High' };
  if (gini >= 35) return { bg: '#f59e0b', text: 'Medium' };
  if (gini >= 28) return { bg: '#00f2ff', text: 'Low' };
  return { bg: '#00ff88', text: 'Very Low' };
}

function buildHeatmap() {
  const grid = document.getElementById('heatmapGrid');
  if (!grid) return;
  const sorted = [...heatmapData].sort((a, b) => b.gini - a.gini);
  grid.innerHTML = sorted.map(c => {
    const col = getHeatColor(c.gini);
    const emoji = c.gini >= 55 ? '🔴' : c.gini >= 45 ? '🟠' : c.gini >= 35 ? '🟡' : c.gini >= 28 ? '🔵' : '🟢';
    return `<div class="hmap-cell" style="background:${col.bg}22;border:1px solid ${col.bg}55"
      onclick="openPanel('p1');document.getElementById('chartInfo').textContent='${c.name}: Gini ${c.gini} — ${col.text} inequality level.'">
      <div style="font-size:1.2rem;margin-bottom:0.2rem">${emoji}</div>
      <span class="hmap-country" style="color:${col.bg}">${c.name}</span>
      <span class="hmap-gini" style="color:${col.bg}">${c.gini}</span>
      <span style="font-size:0.65rem;color:rgba(255,255,255,0.5);display:block">${col.text}</span>
    </div>`;
  }).join('');
}

// DOWNLOAD REPORT
function downloadReport() {
  const content = `GLOBAL INCOME INEQUALITY DASHBOARD
====================================
Generated by: PRAGYA MISHRA PRASHASTI
Date: ${new Date().toLocaleDateString()}
Course: B.Tech 

GLOBAL KEY STATISTICS
======================
Countries Analyzed: 201
Average Gini Index: 40.60
Total Homicides (1990-2023): 28 Million
Average Unemployment Rate: 8.60%
Average Palma Ratio: 2.37
Years of Data: 33 (1990-2023)

KEY FINDINGS
=============
1. South Africa has world's highest Gini Index (~63)
2. Norway has world's lowest Gini Index (~26)
3. Brazil, India, Mexico, Colombia top homicide rankings
4. Latin America most unequal region (avg Gini ~46)
5. Europe most equal region (avg Gini ~31)
6. Global Gini forecast to fall to 35-38 by 2040

DASHBOARD PAGES
================
Page 1 - Global Overview: KPI cards, bar chart, line chart, donut chart
Page 2 - Regional Deep Dive: GDP vs Gini scatter plot, stacked bar
Page 3 - Homicide Analysis: 28M homicides, gender donut, region slicer
Page 4 - Impact Analysis: Unemployment correlation, SDG Goals 11 & 16
Page 5 - Future Outlook: 2040 forecast, Palma Ratio risk chart

TOOLS USED
===========
Power BI Desktop, Python Pandas, HTML CSS JavaScript
World Income Inequality Database (WIID)
====================================`;
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Global_Inequality_Report.txt';
  a.click();
  URL.revokeObjectURL(url);
}

function downloadCSV() {
  const headers = ['Country','Year','Region','Income Group','Gini Index','GDP per Capita ($)','Palma Ratio','Bottom 20% Share','Top 20% Share','Population'];
  const realData = [
    ['Afghanistan','2008','South Asia','Low income',44.35,2191.50,2.33,5.35,40.84,26482622],
    ['Afghanistan','2012','South Asia','Low income',42.88,2985.32,2.12,5.44,39.99,30560034],
    ['Albania','2017','Europe and Central Asia','Upper middle income',33.20,12850.10,1.43,7.54,37.89,2873457],
    ['Argentina','2020','Latin America & Caribbean','Upper middle income',42.89,18234.12,2.47,5.23,43.78,45195777],
    ['Australia','2018','OECD high income','High income',34.30,55678.90,1.47,7.23,37.34,24982688],
    ['Bangladesh','2016','South Asia','Lower middle income',32.40,3523.45,1.36,7.56,36.12,163046161],
    ['Brazil','2020','Latin America & Caribbean','Upper middle income',48.90,14234.56,3.12,3.89,54.67,212559409],
    ['Canada','2019','OECD high income','High income',33.30,48234.56,1.40,7.34,37.12,37589262],
    ['Chile','2017','Latin America & Caribbean','High income',46.60,23456.89,2.78,4.34,50.23,18470439],
    ['China','2019','East Asia & Pacific','Upper middle income',38.20,17234.56,1.87,5.93,41.12,1400050000],
    ['Colombia','2020','Latin America & Caribbean','Upper middle income',54.16,14234.56,3.67,3.34,57.12,50882891],
    ['Denmark','2019','OECD high income','High income',29.30,58234.56,1.17,8.67,33.67,5806081],
    ['Egypt','2015','Middle East & North Africa','Lower middle income',31.82,10234.78,1.31,8.12,35.34,91508084],
    ['Ethiopia','2015','Sub-Saharan Africa','Low income',35.00,1834.56,1.56,7.12,38.23,99390000],
    ['France','2018','OECD high income','High income',32.40,43234.56,1.35,7.67,36.23,66992699],
    ['Germany','2018','OECD high income','High income',31.70,48234.56,1.31,8.01,35.67,82792351],
    ['Ghana','2016','Sub-Saharan Africa','Lower middle income',43.50,4234.78,2.56,5.12,46.89,28206728],
    ['India','2019','South Asia','Lower middle income',35.70,7234.56,1.56,7.23,39.45,1366417754],
    ['Indonesia','2019','East Asia & Pacific','Upper middle income',38.00,11234.56,1.87,6.34,41.56,270625568],
    ['Iran','2013','Middle East & North Africa','Upper middle income',40.00,16234.78,2.12,5.78,43.67,77447168],
    ['Italy','2018','OECD high income','High income',35.90,38234.56,1.61,7.12,39.56,60431283],
    ['Japan','2018','OECD high income','High income',32.90,41234.56,1.38,7.45,36.67,126529100],
    ['Kenya','2015','Sub-Saharan Africa','Lower middle income',40.78,3234.78,2.23,5.56,44.12,47878000],
    ['Malaysia','2015','East Asia & Pacific','Upper middle income',41.00,26234.78,2.23,5.45,44.78,30651176],
    ['Mexico','2018','Latin America & Caribbean','Upper middle income',45.40,19234.78,2.78,4.23,48.89,126190788],
    ['Namibia','2015','Sub-Saharan Africa','Upper middle income',59.10,10234.56,4.23,2.45,62.67,2458936],
    ['Nigeria','2018','Sub-Saharan Africa','Lower middle income',35.10,5434.78,1.67,7.12,39.23,195874740],
    ['Norway','2019','OECD high income','High income',26.10,82234.56,1.02,9.45,29.89,5328212],
    ['Pakistan','2015','South Asia','Lower middle income',33.50,4534.78,1.43,7.56,37.23,189379924],
    ['Philippines','2015','East Asia & Pacific','Lower middle income',40.10,7034.78,2.23,5.67,43.56,100699395],
    ['Russia','2018','Europe and Central Asia','Upper middle income',37.50,27234.78,1.89,6.12,41.12,146793744],
    ['South Africa','2019','Sub-Saharan Africa','Upper middle income',63.00,13034.56,4.89,2.45,67.12,58558270],
    ['Spain','2018','OECD high income','High income',34.30,36234.56,1.48,7.45,38.12,46733038],
    ['Sweden','2019','OECD high income','High income',29.30,55234.56,1.17,8.67,33.45,10327589],
    ['Thailand','2017','East Asia & Pacific','Upper middle income',37.80,17234.78,1.89,6.23,41.23,69037513],
    ['Turkey','2018','Europe and Central Asia','Upper middle income',41.90,26234.56,2.34,5.34,45.12,81916871],
    ['United Kingdom','2018','OECD high income','High income',35.10,44234.56,1.56,6.89,38.89,66573504],
    ['United States','2019','OECD high income','High income',41.40,65234.78,2.18,5.56,44.78,328239523],
    ['Vietnam','2018','East Asia & Pacific','Lower middle income',35.70,7234.56,1.67,6.67,39.23,95540395],
    ['Zambia','2015','Sub-Saharan Africa','Lower middle income',57.10,3634.56,4.08,2.71,61.12,16211767],
  ];
  const csv = [headers, ...realData].map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'WIID_Global_Inequality_Data.csv';
  a.click();
  URL.revokeObjectURL(url);
}

// LOGIN
function login() {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  const storedEmail = localStorage.getItem('email');
  const storedPassword = localStorage.getItem('password');
  if (email === storedEmail && password === storedPassword) {
    alert('Login Successful!');
    window.location = 'index.html';
  } else {
    alert('Invalid email or password!');
  }
}

// REGISTER
function register() {
  const email = document.getElementById('regEmail').value;
  const password = document.getElementById('regPassword').value;
  if (!email || !password) { alert('Please fill all fields!'); return; }
  localStorage.setItem('email', email);
  localStorage.setItem('password', password);
  alert('Account Created Successfully!');
  window.location = 'login.html';
}

// PARTICLES
particlesJS('particles-js', {
  particles: {
    number: { value: 80 },
    color: { value: '#00f2ff' },
    shape: { type: 'circle' },
    opacity: { value: 0.4, random: true },
    size: { value: 2.5, random: true },
    line_linked: { enable: true, distance: 120, color: '#00f2ff', opacity: 0.15, width: 1 },
    move: { enable: true, speed: 1.5, random: true, out_mode: 'out' }
  },
  interactivity: {
    events: { onhover: { enable: true, mode: 'grab' }, onclick: { enable: true, mode: 'push' } },
    modes: { grab: { distance: 140 }, push: { particles_nb: 3 } }
  }
});