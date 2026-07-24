/*
GeoMap Case Studies
ICS4U-01
Ariel Liu, Emma Guo, Juliann Zhu
This Javascript file is the library for the database of GeoMap, a web application designed to help students study the IB Geography course.

History:
Mar 28, 2024: File creation + Addition of many case studies
April 22, 2024: Modification of case study inputs
*/

const yemenJoke = new CaseStudy(
  "Core 1: Changing Populations",
  "Yemen",
  ["How I feel when I pass my geography test... Yemen! hahaha..."],
  ["quickfacts"]
);
const omanJoke = new CaseStudy(
  "Core 1: Changing Populations",
  "Oman",
  [
    "How I feel when Mr. Zervas schedules a new geography test... Oman! hahaha...",
  ],
  ["quickfacts"]
);
const iranJoke = new CaseStudy(
  "Core 1: Changing Populations",
  "Iran",
  ["What did I do when I saw the gingerbread man? Iran! hahaha..."],
  ["quickfacts"]
);
const maliJoke = new CaseStudy(
  "Core 1: Changing Populations",
  "Mali",
  ["Transition metals are...mali-able! hahaha..."],
  ["quickfacts"]
);

// Unit 1: Changing Populations
const japanAging = new CaseStudy(
  "Core 1: Changing Populations",
  "Japan's Aging Population",
  [
    "Japan’s population structure is aging at a rapid speed compared to other countries (with the exception of PIGS (Portugal, Italy, Greece, and Spain). The number of elderly people living alone in Japan has also increased significantly as the percentage of young people gradually declines. In 2015, the percentage of young people only accounted for 13% of the Japan’s population, while the number of elderly people accounted for 26% of the population.",
  ],
  [
    "*Additional Articles to Check Out:*@^https://worldpopulationreview.com/countries/japan-population@^https://www.imf.org/en/Publications/fandd/issues/2020/03/shrinkanomics-policy-lessons-from-japan-on-population-aging-schneider",
  ],
  "assets/Japan_population_pyramid.gif",
  "https://data.worldbank.org/share/widget?indicators=SP.POP.TOTL&locations=JP"
); //[1][2]

const spainDeprivation = new CaseStudy(
  "Core 1: Changing Populations",
  "Deprivation in Barcelona, Spain",
  [
    "Deprivation is said to occur when a person's well-being falls below an 'ideal' level as an acceptable minimum. In 2011, there were more regions with average family incomes less than the city's average family income (mainly in the Eastern hemisphere and some in the Southern hemisphere). The areas of greatest deprivation in Barcelona occur in 2 main locations. The inner city areas (ex: El Raval) and towards the city's edge.",
    "The cycle of poverty is an idea that poverty and deprivation are passed on from one generation to the next. Children of poor parents often receive little parental support and opportunities. For instance, children from high-income families are exposed to 30 million more words by age 3 than children from families on welfare. Follow-up studies have shown that differences in language and interaction experiences have long lasting effects on a child’s performance later in life. Children from low income families attend less adequate schools and do less well. They often end up leaving school at the earliest possible opportunity with few qualifications. The children they have will also experience the same environment of deprivation. These families will remain ‘trapped’ in a cycle of poverty, being unable to improve their circumstances",
  ],
  [
    "*The inner city areas (ex: El Raval):*@^Deprivation in these areas coincides with areas of old and substandard housing built during the industrial revolution to house factory workers@*Towards the city’s edge:*@^Deprivation mainly occurs in the estates of social housing built by the city to house large numbers of migrants from other parts of Spain @Can Peguera is the poorest district of all@^Also known as the “casas baratas” district@^Where the immigrant workers who built the 1929 exhibition initially stayed@The areas with least deprivation are the districts where wealthier people live, concentrated in the northwest of Barcelona and in a new belt lying along the north east coastline",
    "*Additional Articles to Check Out:*@^https://geographyfieldwork.com/Deprivation-and-Poverty-in-Barcelona.htm@^https://www.jstor.org/stable/26796854",
  ],
  "assets/Spain_population_pyramid.gif",
  "https://data.worldbank.org/share/widget?indicators=SP.POP.TOTL&locations=ES"
); //[3][2]

const kenyaDeprivation = new CaseStudy(
  "Core 1: Changing Populations",
  "Kenya",
  [
    "The distribution of poverty is evenly spread across Kenya, with slum settlements found in almost all parts of Nairobi, Kenya's capital. Two features of urban deprivation in Nairobi are: lack of access to healthcare and informal housing. The main concentration of healthcare facilities are in the CBD, though are generally distributed in the higher income areas.",
    "It is difficult to present information about the informal sector in Nairobi due to it being part of the hidden economy, which only takes place when economic activity is not monitored or taxed by the government. This also means that many workers do not have access to basic rights such as protective equipment or sick pay.",
  ],
  [
    "*Additional Articles to Check Out:*@^https://www.worldbank.org/en/country/kenya/publication/kenya-economic-update-poverty-incidence-in-kenya-declined-significantly-but-unlikely-to-be-eradicated-by-2030",
    "assets/Kenya_population_pyramid.png",
  ],
  "https://data.worldbank.org/share/widget?indicators=SP.POP.TOTL&locations=KE"
); //[4][2]

const syriaMigration = new CaseStudy(
  "Core 1: Changing Populations",
  "Syria",
  [
    "Syria was the center of the Ottoman Empire that controlled a large region of Southeast Europe, Western Asia, and Northern Africa between the 14 and early 20th centuries. For reasons relating to violence, many Syrians have been forced each year to leave their homes due to wars; more than 13.7 million have either fled the country or have been displaced within its borders since 2011. Additionally, ever since the civil war began, nearly 13,000 children have lost their lives or been injured, and more than 6.8 million Syrians have been forced to flee their country since 2011 and another 6.9 million Syrians remain internally displaced. Furthermore, many Syrians who are forced to leave their country are placed into refugee camps, which often have poor living conditions due to the large number of people they hold. However, refugees in camps may develop or feel psychological distress, which could be detrimental to their mental health. As a result of poor living conditions, little access to sanitation, shortages of food and water, and psychological distress, death rates are likely to increase, especially in newborns and mothers, which is heavily impactful on the rest of the family.",
  ],
  [
    "*Additional Articles to Check Out:*@^https://www.internetgeography.net/igcse-geography/population-and-settlement-igcse-geography/international-migration-from-syria-to-europe/@^https://www.unhcr.org/news/briefing-notes/seven-factors-behind-movement-syrian-refugees-europe",
  ],
  "assets/Syria_population_pyramid",
  "https://data.worldbank.org/share/widget?indicators=SP.POP.TOTL&locations=SY"
); //[5][2]

// Unit 2: Urban Environments
const uaeRecycling = new CaseStudy(
  "Option G: Urban Environments",
  "United Arab Emirates",
  [
    "Masdar City, UAE, is one of the only highly planned, specialized, research and technology intensive communities with a living environment in Masdar City. More specifically, the city aims to implement architecture that will utilize appropriate wastewater systems and capture condensate, as well as narrower, shaded streets to help channel cooler breezes throughout the city. As a result, the city's temperature in the streets will be 15-20 degrees C lower than the nearby Arabian desert. Furthermore, the engineering designs for Masdar City were conceptualized by the Masdar Institute which also serves as the hub for research and development. The bulding uses 51% less electricity and 54$ less potable water, as wel as a metering system that continuously monitors power usage. However, as of 2016, Masdar City is nowhere close to zeroing out its GHG emissions, and will not reach that goal even if the development ever gets fully implemented.",
  ],
  [
    "*Additional Articles to Check Out:*@^https://www.cityscape-intelligence.com/architecture/why-masdar-worlds-most-sustainable-city@^https://u.ae/en/about-the-uae/digital-uae/digital-cities/smart-sustainable-cities",
  ],
  "assets/UnitedArabEmirates.jpg"
); //[6]

const mexicoCongestion = new CaseStudy(
  "Option G: Urban Environments",
  "Mexico",
  [
    "Mexico City is a metropolitan area of Mexico that has a population of more than 20 million, with levels of nitrogen dioxide regularly surpassing international standards by 2-3 times. Additionally, in 2012, motorized vehicles were responsible for 49% of GHG emissions in the city, raising the level of ozone by over 2 times the maximum allowed limit for 1 hour a year. At the same time, the city's auto ownership is increasing at a rate of 4.2% per year, resulting in the production of more than 7,000 tonnes of pollution each day due to the burning of combustible fuels. In addition, because intense sunlight turns air pollutants into photochemical smog, it prevents the sun from heating the atmosphere sufficiently to penetrate the city's inversion layer causing a significant amount of thick smog. Consequently, the number of hospital visits has surpassed 33,000, along with 4,000 hospital admissions for respiratory distress, and 260 infant deaths each year. Moreover, given that Mexico City's Santa Fe district is a major commercial hub, with 7,000 housing units occupied and 118,000 jobs offered, it is not surprise that there are more than 850,000 trips made in the district every day. However, these conditions have resulted in 41% of business-related trips being conducted by cars, 46% in low-quality buses, 8% in corporate shuttles, and 6% in taxis. As a result, a Santa Fe worker will generally spend an average of 26 days a year travelling to and from work, with transportation expenditures consuming over 20% of an employee's annual salary for those with the lowest earnings.",
  ],
  [
    "*Additional Articles to Check Out:*@^https://www.theperspective.se/2023/04/25/article/urban-poverty-on-the-fringes-of-mexico-city-and-the-challenges-of-informality/@^https://www.theguardian.com/world/2016/jul/06/mexico-city-chokes-on-its-congestion-problem",
  ],
  "assets/Mexico.jpg"
); //[7][2]

const franceCycling = new CaseStudy(
  "Option G: Urban Environments",
  "France",
  [
    "The mayor of Paris, Hidalgo, wants to reconquer public space for pedestrians and cyclists. Her plan began in 2017, when Paris became a Restricted Traffic Zone (RTZ). Since then, all cars have had to carry a Crit'Air Sticker that classifies them based on their level of pollution.The most polluting vehicles are not allowed to drive in the city between 8 am and 8 pm during the week, and drivers who do not carry the sticker are at risk of getting a fine of 68 euros. Furthermore, Hidalgo also plans to stop the production of diesel-powered vehicles as early as 2020; however, the head of public transport union says that this means there will be no more tourist coaches and that 12,500,000 tourists will have trouble getting around the city. Journalist, Frédéric Héran, claims that the number of cyclists in Paris has multiplied by 10, and that there will never be a time when Paris is going to be car-free, as many people like taxi drivers, professionals, emergency services, and residents all need access to a car.",
  ],
  [
    "*Additional Articles to Check Out:*@^https://www.c40.org/case-studies/cities100-paris-transport-policy-curbs-air-pollution/@^https://research.gsd.harvard.edu/tut/files/2020/07/ParisCase2016.pdf",
  ],
  "assets/France.webp",
  "https://tableau-public.discomap.eea.europa.eu/views/City_AQ_Viewer_2023/EuropeanCityRanking?%3Aembed=y&%3AisGuestRedirectFromVizportal=y"
); //[8]

const usaDestroit = new CaseStudy(
  "Option G: Urban Environments",
  "United States",
  [
    "The decline of services in Detroit has been extremely stark and multifaceted. The closure of numerous schools since 2005 has been exacerbated by the city's $300 million debt in 2009 causing public services such as transportation and street lighting to suffer severe cutbacks. This led to a cascade of consequences, including job loss and heightened crime rates. Residents, particularly those in impoverished areas, bore the consequences of these changes, with over half of Detroit's children living in poverty and a dropout rate of 68%, the highest in the country. As services deteriorated, so did the quality of life, with homelessness on the rise and access to healthcare becoming increasingly limited. Crime surged, prompting an exodus of residents seeking safer neighborhoods, leaving behind abandoned homes and plummeting property values. The city's financial crisis deepened, culminating in its historic bankruptcy declaration, with long-term debts estimated at over $18 billion. Unemployment rates soared, disproportionately affecting Black communities, with over 30% of Black youth facing joblessness. Despite these challenges, some areas of Detroit have begun to be reclaimed by nature, signaling both the extent of the city's decline and the potential for renewal.",
  ],
  [
    "*Additional Articles to Check Out:*@^https://harvardurbanreview.org/detroit-decay-displacement-exploitation/",
  ]
);

const chinaTransportation = new CaseStudy(
  "Option G: Urban Environments",
  "China",
  [
    "Shanghai is a major industrial and commercial centre of China and one of the world's largest seaports. However, due to the rapid population growth and the expansion of built-up areas of Shanghai, the demand for  transportation has also increased rather significantly. As a result, Shanghai's integrated transport system (focused on two ports, two highways, and three transport networks) is developing a tranport infrastructure that will deal with increased traffic volumes. Furthermore, Shanghai has over 12,000 km of roads, including nearly 800 km of expressways. The target for planners has been referred to as '15, 30, and 60' to allow motorists in suburban areas to reach an expressway within 15 minutes, then travel to the city centre in 30 minutes, and travel between any two suburban areas in less than 60 minutes. The practical targets of Shanghai's transport strategy are that: public transport between any two parts of the city centre should take less than 60 minutes and just one bus ride.",
  ],
  [
    "*Additional Articles to Check Out:*@^https://www.citiesforum.org/news/what-made-shanghai-the-worlds-no-1-smart-city/@^https://network-king.net/shanghai-is-the-smartest-city-in-the-world/",
  ],
  "assets/China.webp",
  "https://www.google.com/maps/d/embed?mid=1L7y7YQSlsJ4nYi7h9_DYYK_sAK-_5qPw&ehbc=2E312F"
); //[9]

const southKoreaGreen = new CaseStudy(
  "Option G: Urban Environments",
  "South Korea",
  [
    "Songdo, South Korea was positioned as a new global economic center, conceived as a pedestrian friendly city, with walkable streets. In particular, its residential neighbourhoods have large green areas, with all parking below grade, making 40% of the land green space. Furthermore, about 100 buildings have earned the U.S. Green Building Council's LEED certification for compliance with environmental energy criteria, the highest concentration anywhere in the world. In addition, the streets that connect the district are lined with sensors that measure energy use and traffic flow as a means of quantifying sustainability to supports its concentration of LEED-certified projects in the world. Moreover, Songdo's recycling rate is around 76.3% as wastewater is treated and recycled efficiently, with greywater, rather than clean water being directed to toilets. Lastly, Songdo also promotes urban agriculture since the preservation of agricultural land in urban areas can shorten supply chains and the amount of carbon dioxide being emitted when transporting food from rural to urban areas. As a result, the production and selling of fresh food within the city itself is able to reduce the enviornmental impact of food distribution, increase opportunities for inclusive local supply chains, and improve access to nutritious foods, e.g. through farmers' markets.",
  ],
  [
    "*Additional Articles to Check Out:*@^https://ie.unc.edu/cleantech-story/designing-sustainable-cities-songdo/@^https://www.mansionglobal.com/articles/sustainable-and-smart-south-koreas-songdo-offers-green-spaces-and-good-schools-228684",
  ],
  "assets/SouthKorea.webp"
); //[10]

const indiaDecline = new CaseStudy(
  "Option G: Urban Environments",
  "India",
  [
    "Dharavi was an area in the centre of Mumbai made intentionally as the setting of Slumdog Millionaire. Since Mumbai is the commercial capital of India with unlimited opportunity for employment, it attracted people from all parts of the country, therefore making it most suitable for the migrants to encroach and set up informal settlements. However, as Mumbai expanded northwards (with an increasing population and new industries), the pressure on land increased, so Dharavi was drawn into the heart of the city, where slum dwellers squatted and built hutments. Similar redevelopment schemes in other Indian cities have often smashed the heart out of neighbourhoods, destroying social and cultural support networks without meaninfully improving conditions for displaced residents or building something sustainable and vibrant. In response, developers and the government have begun looking at ways to redevelop the area to capture the value of the land. Though, the largest obstacle was the large amount of opposition from current residents who feel that the proposed amount of space is simply not enough. There was also no clearly defined space planned for all the current 'informal' businesses in plcae, raising fears from within the slum that their sources of income could be shut down. Ultimately, to address the grievances of slum dwellers, the city and state governments invited ideas from the global community. More specifically, all current landowners, including the government, needed to release ownership rights to a trust that is governed by former landowners, community members, and neighbourhood associations. This method allows the community to have a voice in the future of its land, while also solving land ownership issues that have slowed down the project.",
  ],
  [
    "*Additional Articles to Check Out:*@^https://www.aljazeera.com/economy/2023/1/24/hopes-and-fears-as-slumdog-millionaire-slum-faces-wrecking-ball@^https://www.cbc.ca/news/world/dharavi-slum-redevelopment-1.6780704",
  ],
  "assets/India.png",
  "https://www.macrotrends.net/global-metrics/cities/21206/mumbai/population"
); //[11]

const swedenEco = new CaseStudy(
  "Option G: Urban Environments",
  "Sweden",
  [
    "Stockholm has grown to become Sweden's largest city by the end of the 13th century due to a trade agreement made with the German city of Lübeck. This agreement ensured Lübeck merchants freedom from customs chargest for their trade in Sweden. A new period of development began with industrialization in the 19th century, introducing municipality-organized cleaning and sanitation. Of the household waste produced in Sweden in 2017, around 15.5% was used for biological recycling, 33.8% for material recycling, and 50.2% for energy recovery. The country's waste-to-energy program burns waste at incineration plants, which supplies heat to more than one million houses in the country. The remaining ashes contribute 15% of the waste volume before burning, though the metals in these ashes are recycled again, with the rest used in road construction. Additionally, the smoke from burning the waste is filtered through dry filters and water, with the dry filters being used to refill abandoned mines. Furthermore, Sweden has a state-of-the art waste collection system with recycling stations located no more than 300 meters from residential areas. This helps to get rid of the smell of garbage from neighbourhoods as a result of the underground deposits. Overall, the Swedish community is well educated in sorting garbage for recycling and the government has strong strategy for its collection and re-use to supply energy.",
  ],
  [
    "*Additional Articles to Check Out:*@^https://www.beesmart.city/en/smart-city-blog/smart-city-stockholm@^https://www.thesmartcityjournal.com/en/smart-city-tv/smart-city-sweden-smarter-cities-with-the-help-of-collaboration",
  ],
  "assets/Sweden.jpg"
); //[12]

const brazilSlums = new CaseStudy(
  "Option G: Urban Environments",
  "Brazil",
  [
    "Rio de Janeiro is a large coastal city in Brazil known for its vast favelas. In the mid 1980s, fishermen and their families began to illegally occupy the land, resulting in an influx of squatters in the region. More specifically, Vila Autódromo is a small favela perched on the edge of the Olympic Park developments in Rio de Janeiro and has been fighting back against Rio’s Olympic development. Ever since Rio was awarded the right to host the Olympic games, many homes in the community have been destroyed to make space for construction works. Due to dwellings being destroyed without warning, some evictions have even turned violent. Additionally, since the favela sits on a lagoon in Rio’s fast-developing West Zone, this would make for prime real estate, fuelling speculation that the current residents are being evicted to free up the land for development. It is estimated that 80% of Vila Autódromo’s 700 or so families have accepted compensation and moved to alternative accommodation. This is the result of a campaign of pressure by the city described by residents as “psychological warfare” and “terrorism”, as well as, with increased money offered as compensation. However, the housing quality is often poor, and essential living costs such as electricity are significantly higher. This has further led to accusations that the program reproduces social inequalities, rather than addressing them.",
  ],
  [
    "*Additional Articles to Check Out:*@^https://www.internetgeography.net/topics/case-study-rio-de-janeiro/@^https://library.brown.edu/create/fivecenturiesofchange/chapters/chapter-9/favelas-in-rio-de-janeiro-past-and-present/",
  ],
  "assets/Brazil.jpg"
); //[13]

// Unit 3: Climate Change

const greeceOlive = new CaseStudy(
  "Core 3: Global Climate",
  "Greece",
  [
    "The production of many crops has dropped as a result of climate change. In this particular instance, droughts and heatwaves are posing a threat to olives, which can typically thrive in harsh, dry conditions. The biggest olive oil producers are found in Southern Europe (such as Spain, Greece, Italy, and Portugal), which is currently a Mediterranean biome. Extreme weather events have been observed to support the biome's predicted shift northward, though. A heatwave coincided with the third year in a succession of little rainfall. The Guadalquivir river, which is used to irrigate the adjacent olive groves, has critically low water levels. Farmers claim that they can only give his trees about half as much water as normal during this growing season. Wildfires have also been starting up, which is altering the local vegetation. Such weather conditions signal the shift to a desert biome.",
  ],
  [
    "*Additional Articles to Check Out:*@^https://www.enicbcmed.eu/artolio-presents-history-olive-oil-cultivation-mediterranean-basin@^https://www.freiheit.org/spain-italy-portugal-and-mediterranean-dialogue/mediterranean-olive-grove-face-climate-change@^https://www.theparliamentmagazine.eu/news/article/olive-oil-climate-change-crisis",
  ],
  "assets/Mediterranean.webp"
); //[14]

const italyOlive = new CaseStudy(
  "Core 3: Global Climate",
  "Italy",
  [
    "The production of many crops has dropped as a result of climate change. In this particular instance, droughts and heatwaves are posing a threat to olives, which can typically thrive in harsh, dry conditions. The biggest olive oil producers are found in Southern Europe (such as Spain, Greece, Italy, and Portugal), which is currently a Mediterranean biome. Extreme weather events have been observed to support the biome's predicted shift northward, though. A heatwave coincided with the third year in a succession of little rainfall. The Guadalquivir river, which is used to irrigate the adjacent olive groves, has critically low water levels. Farmers claim that they can only give his trees about half as much water as normal during this growing season. Wildfires have also been starting up, which is altering the local vegetation. Such weather conditions signal the shift to a desert biome.",
  ],
  [
    "*Additional Articles to Check Out:*@^https://www.enicbcmed.eu/artolio-presents-history-olive-oil-cultivation-mediterranean-basin@^https://www.freiheit.org/spain-italy-portugal-and-mediterranean-dialogue/mediterranean-olive-grove-face-climate-change@^https://www.theparliamentmagazine.eu/news/article/olive-oil-climate-change-crisis",
  ],
  "assets/Mediterranean.webp"
); //[14]

const portugalOlive = new CaseStudy(
  "Core 3: Global Climate",
  "Portugal",
  [
    "The production of many crops has dropped as a result of climate change. In this particular instance, droughts and heatwaves are posing a threat to olives, which can typically thrive in harsh, dry conditions. The biggest olive oil producers are found in Southern Europe (such as Spain, Greece, Italy, and Portugal), which is currently a Mediterranean biome. Extreme weather events have been observed to support the biome's predicted shift northward, though. A heatwave coincided with the third year in a succession of little rainfall. The Guadalquivir river, which is used to irrigate the adjacent olive groves, has critically low water levels. Farmers claim that they can only give his trees about half as much water as normal during this growing season. Wildfires have also been starting up, which is altering the local vegetation. Such weather conditions signal the shift to a desert biome.",
  ],
  [
    "*Additional Articles to Check Out:*@^https://www.enicbcmed.eu/artolio-presents-history-olive-oil-cultivation-mediterranean-basin@^https://www.freiheit.org/spain-italy-portugal-and-mediterranean-dialogue/mediterranean-olive-grove-face-climate-change@^https://www.theparliamentmagazine.eu/news/article/olive-oil-climate-change-crisis",
  ],
  "assets/Mediterranean.webp"
); //[14]

const belgiumMigration = new CaseStudy(
  "Core 3: Global Climate",
  "Belgium",
  [
    "According to the Foresight report, environmental factors, such as climate change, may impact population movements, but they are more likely to do so through intervening obstacles, such as economic, social, demographic, and political factors. The choice to migrate is influenced by household characteristics and prevailing barriers. The Foresight project made a significant contribution by highlighting how environmental variables are a part of a larger system of macro-, meso-, and micro-level drivers. Furthermore, there are prevalent connections between climate change and migration in developing nations, regardless of domestic or international migration. Firstly, moving to less dangerous areas can lessen a person's or family's exposure to climate hazards like recurrent droughts that reduce agricultural output or floods that inundate coastal areas. Second, moving one or more members of a household can be a part of a risk-reduction and livelihood diversification plan whereby remittances from households stifle other revenue streams. Thirdly, migration can also boost family wealth and climate change resilience. Fourth, migration can increase food security for those who stay behind by reducing the number of mouths that need to be fed in a household, particularly during the dry or lean season in agricultural areas. Lastly, returning migrants can improve the prosperity and climate resilience of the communities they left by reintroducing new technologies and skills. To some extent, source and destination areas have also been predicted by researchers using a number of different methods. Exposure models, at their most basic, determine how many people will likely be exposed to a specific hazard, most frequently sea level rise, and predict how many people will relocate. In effect, all forms of mobility, including longer-term migration, are already being impacted by climate change and variability. The majority of migration and displacement caused by climate change will occur internally, but given the expanding population and the potential severity of climate effects, even the relatively small international portion could be significant. There are many reasons why people move, but in instances of mass migration, worries about local safety and security as well as a pervasive hopelessness seem to be fueling ever-more-dangerous journeys.",
  ],
  [
    "*Additional Articles to Check Out:*@^https://www.oecd-ilibrary.org/sites/7e65241a-en/index.html?itemId=/content/component/7e65241a-en",
  ],
  "assets/Belgium.jpg"
); //[15]

const chadAgriculture = new CaseStudy(
  "Core 3: Global Climate",
  "Chad",
  [
    "Agriculture will follow the biomes as they migrate northward due to climate change. As average temperatures rise in the southern hemisphere, there will be more heatwaves and droughts that will hinder crop development. As a consequence, as depicted on the map, production will decline there and agricultural activity will move to the northern hemisphere. Changes in temperature will lengthen the growing season and reduce frost days in the originally cold hemisphere. The chance to plant novel crops will be increased by the average climate being consistently temperate. For instance, viticulture, corn, and wheat will all move north, which will boost their production. In general, yield output is declining more than it is increasing, which may be related to atmospheric carbon dioxide concentrations. Weed growth will rise as a result, reducing crop yields in that area. Extreme weather conditions can also reduce hydrologic resources and reduce the variety of crops available because they make it difficult for crops like rice, which require a lot of water, to thrive. This will affect the economy because prices will go up as a result of the decrease in availability. Prices will rise for the most important agricultural products, including rice, wheat, maize, and soybeans. As a consequence, feeding livestock will cost more, which will raise the price of meat. Food insecurity will therefore rise as a consequence of a more pronounced decline in cereal consumption and a slightly slower increase in meat consumption due to climate change.",
  ],
  [
    "*Additional Articles to Check Out:*@^https://www.undp.org/blog/chad-accelerates-its-race-adapt-climate-change-whats-next@^https://climateknowledgeportal.worldbank.org/country/chad",
  ],
  "assets/Chad.jpg"
); //[16]

const swissAlps = new CaseStudy(
  "Core 3: Global Climate",
  "Switzerland",
  [
    "In the Alpine region, which attracts a substantial 44% of the global ski visitor population annually, there exists a concerning trend regarding snow depth. Projections reveal a consistent decline in snow thickness, estimated at around 20-30% across the years 2035, 2060, and 2085. However, as the analysis extends towards the latter part of the century, these reductions become more pronounced. For instance, in Swiss regions, the projected snow changes range from 30% for RCP3PD to nearly 60% and 70% for the A1B and A2 scenarios, respectively. This phenomenon is primarily driven by escalating temperatures, with precipitation increases failing to offset the warming effects, resulting in more rainfall than snowfall. Moreover, concerning elevation, ski resorts with adequate snow cover are facing the grim reality of shorter seasons as global temperatures soar. For example, a season lasting approximately 6 ½ months at an elevation of 1,500 meters could potentially diminish to merely 4 months by mid-century under the A2 scenario, and further dwindle to a mere 2 months by the end of the century. This dwindling natural snowfall poses a significant threat to Alpine villages heavily reliant on winter tourism, with some local economies depending up to 90% on it. Empirical evidence from the 2016-17 ski season in Swiss resorts demonstrated a concerning 13% drop in ski lift usage, indicative of substantial income loss. In response to these challenges, many resorts have turned to artificial snow production, with a significant portion of slopes in Switzerland, Austria, and certain Italian resorts relying on it. However, this approach is not without its drawbacks, as it is both water and energy-intensive, as well as financially burdensome.",
  ],
  [
    "*Additional Articles to Check Out:*@^https://creamontblanc.org/en/climate-change-and-its-impacts-alps/@^https://www.bbc.com/future/article/20230322-how-climate-change-is-melting-permafrost-in-the-alps@^https://www.theguardian.com/environment/2022/jul/29/how-climate-change-is-melting-the-alps-glaciers-in-pictures@^https://www.weforum.org/agenda/2022/07/freezing-points-swiss-alpine-summits-climate-change/",
  ],
  "assets/Switzerland.jpg"
); //[17]

const unitedHeating = new CaseStudy(
  "Core 3: Global Climate",
  "United Kingdom",
  [
    "In recent years, Britain has experienced notable shifts in weather patterns, attributed to the effects of global warming. More specifically, Britain has witnessed a spike in summer mortality rates, often attributed to heat-related illnesses. Excess winter deaths have also been a concern, particularly among socioeconomically disadvantaged populations, due to the high costs associated with heating homes. However, the advent of global warming has brought about unexpected changes in weather-related mortality trends. In recent years, there has been a noticeable decline in the summer mortality spike, coinciding with a reduction in excess winter deaths. This shift has been attributed, in part, to a decrease in heating costs facilitated by global warming, enabling greater affordability of heating for lower-income households. Furthermore, despite perceptions of worsening weather extremes, the mortality rate from droughts, floods, and storms has significantly decreased since the 1920s. This decline is not indicative of a reduction in the severity of weather events but rather underscores the correlation between socioeconomic development and enhanced resilience to natural disasters. In response to these changing weather patterns, individuals and communities in Britain have adopted various adaptive measures. These include investments in energy-efficient heating systems to mitigate winter cold, as well as the implementation of flood defenses and early warning systems to minimize the impact of extreme weather events.",
  ],
  [
    "*Additional Articles to Check Out:*@^https://www.gov.uk/guidance/climate-change-explained@^https://climateknowledgeportal.worldbank.org/country/united-kingdom",
  ]
);

// Food and Health
const ethiopiaFamine = new CaseStudy(
  "Option F: Food and Health",
  "Ethiopia",
  [
    "In 2015 and 2016, the seasonal rains that usually fall between June and September in north-eastern, central and southern Ethiopia did not arrive. According to the UN, this was Ethiopia's worst drought in 50 years. Around 90% of cereal production is harvested in autumn, after the summer long rainy season, and the rest at the end of spring after the end of the short rainy season. As a result, more than 18 million people were in need of aid. The drought was caused by the El Nino weather system, and resulted in a 90% reduction in crop yields and the deaths of over one million cattle. The famine, though, was brought about by factors including poor governance and state neglect. The key factors driving the famine, then and now, include the selling off of land to international corporations for industrial farming (land grabs). Nevertheless, a number of organizations are working in Ethiopia, including the World Food Programme (WFP), Save the Children and the FAO. The WFP is helping to feed the refugees and also supporting the government's second five-year Growth and Transformation Plan (GTP), a school meals programme and a vulnerability and mapping unit (VAM). Save the Children Ethiopia also reported substantial livestock losses in the Afar region. It had also mobilized $100 million, while the FAO announced a $50 million plan to assist agriculture- and livestock-dependent households.",
    "bulletpoint1*bulletpoint2",
  ],
  [
    "*Additional Articles to Check Out:*@^https://www.cbc.ca/documentarychannel/features/ethiopias-unforgettable-famines-heres-why-they-really-happen@^https://www.theguardian.com/global-development/2024/feb/09/tigray-ethiopia-war-drought-aid-suspended-hunger-crisis-death-desperation",
  ],
  "assets/Ethiopia.avif"
); //[18]

const bangladeshFoodInsecurity = new CaseStudy(
  "Option F: Food and Health",
  "Bangladesh",
  [
    "Food insecurity in Bangladesh is affected by international trade, land scarcity, the need to increase production of nutritional food, natural hazards and climate change. However, Bangladesh has made significant progress in improving food security by increasing production of rice using irrigation water and high-yielding varieties. The government has also invested in storage facilities for rice, and cold-storage facilities for meat, fish, eggs, and potatoes. Transport infrastructure has also been upgraded to enable faster and better distribution of food. Nevertheless, nearly 50 million people are still said to be food insecure, 26 million of whom are said to be extremely food insecure. Many of these are rural dwellers who are vulnerable to the annual monsoon floods.",
  ],
  [
    "*Additional Articles to Check Out:*@^https://www.thedailystar.net/opinion/views/news/food-insecurity-haunting-our-poor-3455606@^https://www.wfp.org/countries/bangladesh@^https://www.usaid.gov/food-assistance/bangladesh",
  ],
  "assets/Bangladesh.jpeg"
); // [19]

// javascript map of the case studies - key with name and unit, then info - make sure to include space at the end of first item [20]
const caseStudiesMap = new Map([
  ["Yemen", yemenJoke],
  ["Oman", omanJoke],
  ["Iran", iranJoke],
  ["Mali", maliJoke],
  ["Japan", japanAging],
  ["Spain", spainDeprivation],
  ["Kenya", kenyaDeprivation],
  ["Syria", syriaMigration],
  ["United Arab Emirates", uaeRecycling],
  ["Mexico", mexicoCongestion],
  ["South Korea", southKoreaGreen],
  ["France", franceCycling],
  ["China", chinaTransportation],
  ["Greece", greeceOlive],
  ["Italy", italyOlive],
  ["Portugal", portugalOlive],
  ["United States", usaDestroit],
  ["India", indiaDecline],
  ["Belgium", belgiumMigration],
  ["Chad", chadAgriculture],
  ["Brazil", brazilSlums],
  ["Ethiopia", ethiopiaFamine],
  ["Bangladesh", bangladeshFoodInsecurity],
  ["Switzerland", swissAlps],
  ["United Kingdom", unitedHeating],
  ["Sweden", swedenEco],
]);

console.log(japanAging.quickfacts);

/**
 * Bibliography
 * [1] Wikipedia Contributors, “Aging of Japan,” Wikipedia, Mar. 15, 2019. Available: https://en.wikipedia.org/wiki/Aging_of_Japan. [Accessed: Apr. 11, 2024]
 * [2] T. Khokhar and V. Vaid, World Bank Open Data, https://data.worldbank.org/ (accessed Apr. 11, 2024).
 * [3] “Demographics of Spain,” Wikipedia, https://en.wikipedia.org/wiki/Demographics_of_Spain (accessed Apr. 11, 2024).
 * [4] Wikipedia Contributors, “Demographics of Kenya,” Wikipedia, Aug. 28, 2019. Available: https://en.wikipedia.org/wiki/Demographics_of_Kenya. [Accessed: Apr. 11, 2024]
 * [5] Wikipedia Contributors, “Demographics of Syria,” Wikipedia, Dec. 09, 2019. Available: https://en.wikipedia.org/wiki/Demographics_of_Syria. [Accessed: Apr. 11, 2024]
 * [6] S. Writer, “Abu Dhabi issues new AI law, introduces council to develop sector,” arabianbusiness, https://www.arabianbusiness.com/industries/technology/abu-dhabi-issues-new-ai-law-introduces-council-to-develop-sector (accessed Apr. 11, 2024).
 * [7] “Favela, campamento o chabola. ¿Deberíamos dejar de llamarlos así?,” ArchDaily México, Oct. 01, 2018. https://www.archdaily.mx/mx/902957/favela-campamento-o-chabola-deberiamos-dejar-de-llamarlos-asi (accessed Apr. 11, 2024).
 * [8] A. Nossiter, “The Greening of Paris Makes Its Mayor More Than a Few Enemies (Published 2019),” The New York Times, Oct. 05, 2019. Available: https://www.nytimes.com/2019/10/05/world/europe/paris-anne-hildago-green-city-climate-change.html
 * [9] salimi, “China (Shanghai) International Technology Fair,” WIIPA, Feb. 07, 2022. https://wiipa.org/1366/china-shanghai-international-technology-fair/ (accessed Apr. 11, 2024).
 * [10] “New Songdo City,” KPF. https://www.kpf.com/project/new-songdo-city
 * [11] P. Rongmei, “Mumbai’s Dharavi: What’s life like in Asia’s largest slum?,” The Times of India, Oct. 09, 2023. Available: https://timesofindia.indiatimes.com/travel/destinations/mumbais-dharavi-whats-life-like-in-asias-largest-slum/articleshow/104286016.cms
 * [12] B. Zelki, “Stockholm: Transport plans accompany housing development,” Railway Gazette International. https://www.railwaygazette.com/long-reads/stockholm-transport-plans-accompany-housing-development/54760.article (accessed Apr. 11, 2024).
 * [13] E. Sekine, “What Is Freedom in a Brazilian Favela?,” SAPIENS, Sep. 13, 2022. https://www.sapiens.org/culture/minoritarian-liberalism/
 * [14] (Greece. Italy, Portugal) I. Alonso, “How will a Changing Climate Affect Olive Trees?,” www.foodunfolded.com, Jun. 22, 2022. Available: https://www.foodunfolded.com/article/how-will-a-changing-climate-affect-olive-trees. [Accessed: Apr. 11, 2024]
 * [15] (Belgium) “Africa Climate Summit: Towards a Greater Response to Climate Change Impacts on Human Mobility,” International Organization for Migration, Sep. 01, 2023. Available: https://www.iom.int/news/africa-climate-summit-towards-greater-response-climate-change-impacts-human-mobility. [Accessed: Apr. 11, 2024]
 * [16] (Chad) “Approaches to Sustainable Agriculture in the Face of Climate Change,” hivve, Jul. 19, 2022. Available: https://hivve.tech/sustainable-agriculture-climate-change-heatwave/. [Accessed: Apr. 11, 2024]
 * [17] (Switzerland) D. Elliott, “These chilling images expose climate change effects on a glacier,” World Economic Forum, Oct. 22, 2019. Available: https://www.weforum.org/agenda/2019/10/climate-change-glaciers-the-alps-mont-blanc/. [Accessed: Apr. 11, 2024]
 * [18] (Ethiopia) Z. Moloo, “Ethiopia’s unforgettable famines: Here’s why they really happen,” CBC. Available: https://www.cbc.ca/documentarychannel/features/ethiopias-unforgettable-famines-heres-why-they-really-happen. [Accessed: Apr. 11, 2024]
 * [19] (Bangladesh) S. Buhr, “For Rohingya in Bangladesh, food is not enough | World Food Programme,” www.wfp.org, Oct. 09, 2017. Available: https://www.wfp.org/stories/rohingya-bangladesh-food-not-enough. [Accessed: Apr. 11, 2024]
 * [20] W3Schools, “JavaScript Maps,” W3schools.com, 2015. https://www.w3schools.com/js/js_object_maps.asp (accessed Feb. 15, 2024).
 * */
