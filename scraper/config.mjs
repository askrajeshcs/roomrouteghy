export const SOURCES = [
  { name: "OLX", url: "https://www.olx.in/guwahati_g4058604/q-room-rent", linkPattern: /\/item\/.*rent/i },
  { name: "Housing.com", url: "https://housing.com/rent/single-room-for-rent-in-guwahati-assam-C3P47ict1f3zqkkhvr5", linkPattern: /housing\.com\/rent\/\d+/i },
  { name: "Bricklet", url: "https://bricklet.in/room-for-rent-in-guwahati", linkPattern: /bricklet\.in\/(?:property|room|listing)/i },
  { name: "99acres", url: "https://www.99acres.com/single-rooms-for-rent-in-guwahati-ffid", linkPattern: /99acres\.com\/.*(?:rent|property)/i },
  { name: "Facebook", url: "https://www.facebook.com/groups/2109004379274740/", linkPattern: /facebook\.com\/groups\/2109004379274740\/posts\//i, facebook: true }
];

export const MAX_LISTINGS_PER_SOURCE = Number(process.env.MAX_LISTINGS_PER_SOURCE || 35);
export const NAVIGATION_TIMEOUT_MS = Number(process.env.NAVIGATION_TIMEOUT_MS || 45000);

export const LOCALITIES = {
  "Ahom Gaon": [26.1017, 91.7606], "Ambari": [26.1872, 91.7508], "Ambikagiri Nagar": [26.1694, 91.7821],
  "Athgaon": [26.1734, 91.7374], "Barbari": [26.1608, 91.8252], "Barsajai": [26.1064, 91.7854],
  "Basisthapur": [26.1430, 91.8034], "Beltola": [26.1198, 91.8037], "Bhangagarh": [26.1649, 91.7656],
  "Bharalumukh": [26.1818, 91.7308], "Bhaskar Nagar": [26.1590, 91.7508], "Bhetapara": [26.1225, 91.7887],
  "Borbari": [26.1267, 91.8185], "Bormotoria": [26.1469, 91.8206], "Chandmari": [26.1836, 91.7794],
  "Christian Basti": [26.1595, 91.7730], "Dakshingaon": [26.1222, 91.7568], "Dhirenpara": [26.1355, 91.7227],
  "Dispur": [26.1433, 91.7920], "Downtown": [26.1584, 91.8012], "Gandhi Basti": [26.1832, 91.7647],
  "Ganeshguri": [26.1495, 91.7867], "Geetanagar": [26.1734, 91.7958], "Guwahati University": [26.1543, 91.6670],
  "Hatigaon": [26.1327, 91.7903], "Hengrabari": [26.1595, 91.8162], "Jalukbari": [26.1445, 91.6808],
  "Japorigog": [26.1614, 91.7908], "Jyotikuchi": [26.1259, 91.7317], "Kahilipara": [26.1287, 91.7529],
  "Kalapahar": [26.1457, 91.7438], "Kamakhya": [26.1648, 91.7036], "Khanapara": [26.1215, 91.8264],
  "Lachit Nagar": [26.1777, 91.7589], "Lachat Nagar": [26.1777, 91.7589], "Lal Ganesh": [26.1362, 91.7410],
  "Lalmati": [26.1067, 91.7799], "Lokhra": [26.1119, 91.7462], "Maligaon": [26.1598, 91.6967],
  "Narengi": [26.1815, 91.8372], "Nayanpur": [26.1651, 91.7777], "Noonmati": [26.1977, 91.8026],
  "Odalbakra": [26.1375, 91.7477], "Paltan Bazar": [26.1793, 91.7500], "Panjabari": [26.1454, 91.8347],
  "Rajgarh": [26.1777, 91.7635], "Rehabari": [26.1735, 91.7442], "Rukmini Gaon": [26.1397, 91.8062],
  "Santipur": [26.1730, 91.7358], "Sawkuchi": [26.1111, 91.7690], "Silpukhuri": [26.1862, 91.7716],
  "Six Mile": [26.1397, 91.8130], "Udalbakra": [26.1375, 91.7477], "Ulubari": [26.1732, 91.7517],
  "Uzan Bazar": [26.1881, 91.7575], "Zoo Road": [26.1694, 91.7821], "Zoo Tiniali": [26.1756, 91.7888]
};
