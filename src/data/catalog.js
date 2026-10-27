import ticketPricing from "../../shared/ticket-pricing.json";

const movieImages = [
    "photo-1489599849927-2ee91cede3ba",
    "photo-1485846234645-a62644f84728",
    "photo-1517604931442-7e0c8ed2963c",
    "photo-1536440136628-849c177e76a1",
    "photo-1519608487953-e999c86e7455",
    "photo-1478720568477-152d9b164e26",
    "photo-1440404653325-ab127d49abc1",
    "photo-1489599849927-2ee91cede3ba",
    "photo-1485846234645-a62644f84728",
    "photo-1517604931442-7e0c8ed2963c"
];

const eventImages = [
    "photo-1501386761578-eac5c94b800a",
    "photo-1527224538127-2104bb71c51b",
    "photo-1540575467063-178a50c2df87",
    "photo-1492684223066-81342ee5ff30",
    "photo-1506157786151-b8491531f063",
    "photo-1516280440614-37939bbacd81",
    "photo-1459749411175-04bf5292ceea",
    "photo-1501612780327-45045538702b",
    "photo-1524368535928-5b5e00ddc76b",
    "photo-1514525253161-7a46d19cd819"
];

const imageUrl = (photoId) =>
    `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=800&q=80`;

export const fallbackImage = imageUrl("photo-1489599849927-2ee91cede3ba");

const movieDetails = [
    ["Skyline Mission", "Hindi", "4.7", "Action", "2h 18m"],
    ["The Last Journey", "English", "4.5", "Drama", "2h 05m"],
    ["Neon Nights", "Hindi", "4.6", "Thriller", "2h 12m"],
    ["Ocean Dreams", "English", "4.4", "Adventure", "1h 58m"],
    ["The Avengers", "English, Hindi", "4.6", "Action", "2h 45m"],
    ["Monsoon Letters", "Hindi", "4.3", "Romance", "2h 08m"],
    ["Midnight Express", "English", "4.2", "Thriller", "1h 54m"],
    ["The Silent Valley", "Hindi", "4.5", "Mystery", "2h 16m"],
    ["City of Stars", "English", "4.4", "Drama", "2h 01m"],
    ["Chasing Tomorrow", "Hindi", "4.6", "Adventure", "2h 20m"],
    ["Crimson Code", "English", "4.3", "Action", "2h 11m"],
    ["A Sunday in Paris", "Hindi", "4.2", "Romance", "1h 49m"],
    ["The Final Orbit", "English", "4.7", "Sci-Fi", "2h 24m"],
    ["Desert Kingdom", "Hindi", "4.5", "Action", "2h 32m"],
    ["Paper Moon", "English", "4.1", "Drama", "1h 52m"],
    ["The Hidden Room", "Hindi", "4.4", "Mystery", "2h 03m"],
    ["Wild Horizon", "English", "4.6", "Adventure", "2h 14m"],
    ["Heartbeat Highway", "Hindi", "4.3", "Romance", "2h 06m"],
    ["Shadow Protocol", "English", "4.5", "Thriller", "2h 09m"],
    ["The Last Maharaja", "Hindi", "4.7", "Drama", "2h 28m"],
    ["Parallel Worlds", "English", "4.4", "Sci-Fi", "2h 17m"],
    ["River of Gold", "Hindi", "4.2", "Adventure", "1h 59m"],
    ["One More Chance", "English", "4.3", "Comedy", "1h 46m"],
    ["Rangila Raasta", "Hindi", "4.6", "Comedy", "2h 02m"],
    ["Frozen Signal", "English", "4.1", "Thriller", "1h 57m"],
    ["The Blue Umbrella", "Hindi", "4.5", "Family", "1h 51m"],
    ["After the Rain", "English", "4.2", "Romance", "2h 04m"],
    ["Operation Safeguard", "Hindi", "4.4", "Action", "2h 19m"],
    ["Starlight Avenue", "English", "4.6", "Musical", "2h 10m"],
    ["The Eighth Wonder", "Hindi", "4.3", "Fantasy", "2h 22m"]
];

export const movies = movieDetails.map(
    ([title, language, rating, genre, duration], index) => ({
        title,
        language,
        rating,
        genre,
        duration,
        image: imageUrl(movieImages[index % movieImages.length])
    })
);

const eventDetails = [
    ["Live Music Festival", "Nov 08, 2026", "Riverfront Arena"],
    ["Comedy Night", "Nov 12, 2026", "City Convention Hall"],
    ["Tech Expo 2026", "Nov 15, 2026", "Expo Center"],
    ["Art & Culture Fest", "Nov 19, 2026", "City Art Gallery"],
    ["Winter Night Club Fest", "Nov 22, 2026", "Gift City, Gandhinagar"],
    ["Acoustic Evenings", "Nov 26, 2026", "Sabarmati Amphitheatre"],
    ["Gujarat Food Carnival", "Nov 29, 2026", "Riverfront Grounds"],
    ["Indie Film Weekend", "Dec 02, 2026", "Downtown Cinema"],
    ["The Great Garba Night", "Dec 05, 2026", "S.G. Highway Arena"],
    ["Jazz by the River", "Dec 08, 2026", "Riverfront Promenade"],
    ["Startup Founders Meet", "Dec 10, 2026", "Innovation Hub"],
    ["Stand-up Spotlight", "Dec 12, 2026", "Laugh House Theatre"],
    ["Classical Dance Showcase", "Dec 14, 2026", "Tagore Hall"],
    ["Design & Makers Market", "Dec 16, 2026", "City Art Gallery"],
    ["Electronic Music Night", "Dec 18, 2026", "Pulse Club"],
    ["Book Lovers Festival", "Dec 20, 2026", "Sabarmati Convention Centre"],
    ["Holiday Lights Concert", "Dec 22, 2026", "Riverfront Arena"],
    ["Family Fun Fair", "Dec 24, 2026", "City Exhibition Grounds"],
    ["Gujarati Theatre Week", "Dec 26, 2026", "Rangmanch Theatre"],
    ["New Year Countdown", "Dec 31, 2026", "Gift City, Gandhinagar"],
    ["Winter Photography Walk", "Jan 03, 2027", "Sabarmati Riverfront"],
    ["Street Food After Dark", "Jan 07, 2027", "Law Garden"],
    ["Acoustic Guitar Sessions", "Jan 10, 2027", "The Green Room"],
    ["Ahmedabad Science Fair", "Jan 14, 2027", "Science City"],
    ["Bollywood Dance Workshop", "Jan 17, 2027", "Nritya Studio"],
    ["Sufi Music Mehfil", "Jan 21, 2027", "Tagore Hall"],
    ["Vintage Car Showcase", "Jan 24, 2027", "Riverfront Grounds"],
    ["Coffee & Conversations", "Jan 28, 2027", "Urban Brew Cafe"],
    ["Theatre Improv Jam", "Jan 31, 2027", "Laugh House Theatre"],
    ["Spring Color Festival", "Feb 04, 2027", "S.G. Highway Arena"]
];

export const events = eventDetails.map(
    ([title, date, venue], index) => ({
        title,
        date,
        venue,
        price: ticketPricing.eventTicketPrices[title],
        image: imageUrl(eventImages[index % eventImages.length])
    })
);
