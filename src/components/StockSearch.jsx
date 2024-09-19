// import React, { useState } from "react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";
// import { Search, TrendingUp, DollarSign, PieChart } from "lucide-react";
// import {
//   Card,
//   CardHeader,
//   CardContent,
//   CardFooter,
// } from "../components/ui/card";
// import { Input } from "../components/ui/input";
// import { Button } from "../components/ui/button";

// const colors = {
//   primary: "#3498db",
//   secondary: "#2ecc71",
//   accent: "#e74c3c",
//   neutral: "#34495e",
//   light: "#ecf0f1",
// };

// const API_KEY = "KHRDBILOQH39VZJB"; // Replace with your actual API key

// const StockSearch = () => {
//   const [stock, setStock] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [timeFrame, setTimeFrame] = useState("1Y");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const fetchStockData = async () => {
//     setLoading(true);
//     setError("");
//     try {
//       // Fetch current stock data
//       const quoteResponse = await fetch(
//         `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${searchTerm}&apikey=${API_KEY}`
//       );
//       const quoteData = await quoteResponse.json();

//       if (quoteData["Global Quote"]) {
//         const currentData = quoteData["Global Quote"];

//         // Fetch historical data

//         const historyResponse = await fetch(
//           `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${searchTerm}&apikey=${API_KEY}`
//         );
//         const historyData = await historyResponse.json();

//         if (historyData["Time Series (Daily)"]) {
//           const historicalPrices = Object.entries(
//             historyData["Time Series (Daily)"]
//           )
//             .map(([date, values]) => ({
//               date,
//               price: parseFloat(values["4. close"]),
//             }))
//             .reverse();

//           setStock({
//             symbol: searchTerm.toUpperCase(),
//             price: parseFloat(currentData["05. price"]),
//             change: parseFloat(currentData["09. change"]),
//             changePercent: parseFloat(currentData["10. change percent"]),
//             historicalData: historicalPrices,
//           });
//         } else {
//           setError("Unable to fetch historical data");
//         }
//       } else {
//         setError("Stock not found");
//       }
//     } catch (err) {
//       setError("An error occurred while fetching data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (searchTerm) {
//       fetchStockData();
//     }
//   };

//   const filterData = (data) => {
//     const days = timeFrame === "3M" ? 90 : timeFrame === "6M" ? 180 : 365;
//     return data.slice(-days);
//   };

//   return (
//     <div
//       className="p-4 max-w-4xl mx-auto"
//       style={{ backgroundColor: colors.light }}
//     >
//       <form
//         onSubmit={handleSearch}
//         className="flex flex-col sm:flex-row gap-2 mb-4"
//       >
//         <Input
//           type="text"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           placeholder="Enter stock symbol"
//           className="flex-grow"
//           style={{ backgroundColor: "white", color: colors.neutral }}
//         />
//         <Button
//           type="submit"
//           className="w-full sm:w-auto"
//           style={{ backgroundColor: colors.primary, color: "white" }}
//           disabled={loading}
//         >
//           {loading ? (
//             "Loading..."
//           ) : (
//             <>
//               <Search size={20} className="mr-2" /> Search
//             </>
//           )}
//         </Button>
//       </form>

//       {error && <p className="text-red-500 mb-4">{error}</p>}

//       {stock && (
//         <>
//           <Card
//             className="mb-4 overflow-hidden"
//             style={{ backgroundColor: colors.neutral, color: "white" }}
//           >
//             <CardHeader className="flex flex-col sm:flex-row justify-between items-center">
//               <h2 className="text-2xl font-bold mb-2 sm:mb-0">
//                 {stock.symbol}
//               </h2>
//               <div className="flex items-center gap-2">
//                 <DollarSign size={20} style={{ color: colors.secondary }} />
//                 <span className="text-xl">{stock.price.toFixed(2)}</span>
//               </div>
//             </CardHeader>
//             <CardContent>
//               <div className="flex flex-col sm:flex-row justify-between items-center">
//                 <div className="flex items-center gap-2 mb-2 sm:mb-0">
//                   <TrendingUp
//                     size={20}
//                     style={{
//                       color:
//                         stock.change >= 0 ? colors.secondary : colors.accent,
//                     }}
//                   />
//                   <span
//                     className={`text-lg ${
//                       stock.change >= 0 ? "text-green-300" : "text-red-300"
//                     }`}
//                   >
//                     {stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}
//                     %)
//                   </span>
//                 </div>
//                 <PieChart size={40} style={{ color: colors.primary }} />
//               </div>
//             </CardContent>
//           </Card>

//           <Card style={{ backgroundColor: "white" }}>
//             <CardHeader>
//               <h3
//                 className="text-xl font-semibold"
//                 style={{ color: colors.neutral }}
//               >
//                 Historical Prices
//               </h3>
//             </CardHeader>
//             <CardContent>
//               <ResponsiveContainer width="100%" height={300}>
//                 <LineChart data={filterData(stock.historicalData)}>
//                   <XAxis dataKey="date" stroke={colors.neutral} />
//                   <YAxis stroke={colors.neutral} />
//                   <Tooltip
//                     contentStyle={{
//                       backgroundColor: colors.light,
//                       borderColor: colors.primary,
//                     }}
//                     labelStyle={{ color: colors.neutral }}
//                   />
//                   <Line
//                     type="monotone"
//                     dataKey="price"
//                     stroke={colors.primary}
//                     strokeWidth={2}
//                     dot={false}
//                   />
//                 </LineChart>
//               </ResponsiveContainer>
//             </CardContent>
//             <CardFooter className="flex justify-center gap-2 flex-wrap">
//               {["3M", "6M", "1Y"].map((period) => (
//                 <Button
//                   key={period}
//                   onClick={() => setTimeFrame(period)}
//                   style={{
//                     backgroundColor:
//                       timeFrame === period ? colors.primary : "transparent",
//                     color: timeFrame === period ? "white" : colors.primary,
//                     border: `1px solid ${colors.primary}`,
//                   }}
//                   className="flex-grow sm:flex-grow-0"
//                 >
//                   {period}
//                 </Button>
//               ))}
//             </CardFooter>
//           </Card>
//         </>
//       )}
//     </div>
//   );
// };

// export default StockSearch;
import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChevronRight, BarChart2, CreditCard, Home, User } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

const API_KEY = import.meta.env.VITE_API_KEY; // Replace with your actual API key

const StockSearch = () => {
  const [stock, setStock] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [timeFrame, setTimeFrame] = useState("1W");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchStockData = async () => {
    setLoading(true);
    setError("");
    try {
      const quoteResponse = await fetch(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${searchTerm}&apikey=${API_KEY}`
      );
      const quoteData = await quoteResponse.json();

      if (quoteData["Global Quote"]) {
        const currentData = quoteData["Global Quote"];
        const historyResponse = await fetch(
          `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${searchTerm}&outputsize=full&apikey=${API_KEY}`
        );
        const historyData = await historyResponse.json();

        if (historyData["Time Series (Daily)"]) {
          const historicalPrices = Object.entries(
            historyData["Time Series (Daily)"]
          )
            .map(([date, values]) => ({
              date,
              price: parseFloat(values["4. close"]),
            }))
            .reverse();

          setStock({
            symbol: searchTerm.toUpperCase(),
            name: await fetchCompanyName(searchTerm),
            price: parseFloat(currentData["05. price"]),
            change: parseFloat(currentData["09. change"]),
            changePercent: parseFloat(currentData["10. change percent"]),
            open: parseFloat(currentData["02. open"]),
            high: parseFloat(currentData["03. high"]),
            low: parseFloat(currentData["04. low"]),
            volume: parseFloat(currentData["06. volume"]),
            historicalData: historicalPrices,
          });
        } else {
          setError("Unable to fetch historical data");
        }
      } else {
        setError("Stock not found");
      }
    } catch (err) {
      setError("An error occurred while fetching data");
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanyName = async (symbol) => {
    try {
      const response = await fetch(
        `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${API_KEY}`
      );
      const data = await response.json();
      return data.Name || symbol;
    } catch (error) {
      console.error("Error fetching company name:", error);
      return symbol;
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm) {
      fetchStockData();
    }
  };

  const filterData = (data) => {
    const now = new Date();
    const periods = {
      "1D": 1,
      "1W": 7,
      "1M": 30,
      "3M": 90,
      "1Y": 365,
    };
    const days = periods[timeFrame];
    const startDate = new Date(now.setDate(now.getDate() - days));
    return data.filter((item) => new Date(item.date) >= startDate);
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-gray-100 rounded-xl">
      <form onSubmit={handleSearch} className="flex gap-2 mb-4 rounded-lg">
        <Input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Enter stock symbol"
          className="flex-grow rounded-xl"
        />
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 sm:w-auto rounded-xl text-white"
        >
          {loading ? "Loading..." : "Search"}
        </Button>
      </form>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {stock && (
        <Card className="bg-white shadow-lg rounded-xl overflow-hidden">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-2xl font-bold">{stock.symbol}</h2>
                <p className="text-4xl font-bold">${stock.price.toFixed(2)}</p>
                <p
                  className={`text-sm ${
                    stock.change >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  Today {stock.changePercent.toFixed(2)}%
                </p>
              </div>
              <ChevronRight className="text-gray-400" />
            </div>

            <div className="mb-4">
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={filterData(stock.historicalData)}>
                  <XAxis dataKey="date" hide />
                  <YAxis hide domain={["dataMin", "dataMax"]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      borderColor: "#e0e0e0",
                    }}
                    labelStyle={{ color: "#333" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="#2196F3"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="flex justify-between mb-4">
              {["1D", "1W", "1M", "3M", "1Y"].map((period) => (
                <Button
                  key={period}
                  onClick={() => setTimeFrame(period)}
                  variant={timeFrame === period ? "default" : "outline"}
                  className="text-xs px-2 py-1 rounded-xl"
                >
                  {period}
                </Button>
              ))}
            </div>

            <h3 className="text-xl font-bold mb-2">{stock.name}</h3>
            <p className="text-gray-600 mb-2">{stock.symbol}</p>
            <p className="text-gray-600 mb-4">NASDAQ: {stock.symbol}</p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Open</p>
                <p className="font-bold">${stock.open.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-gray-600">High</p>
                <p className="font-bold">${stock.high.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-gray-600">Low</p>
                <p className="font-bold">${stock.low.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-gray-600">Volume</p>
                <p className="font-bold">{stock.volume.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
          <div className="flex justify-around py-4 bg-gray-50">
            <BarChart2 className="text-gray-400" />
            <CreditCard className="text-gray-400" />
            <Home className="text-gray-400" />
            <User className="text-gray-400" />
          </div>
        </Card>
      )}
    </div>
  );
};

export default StockSearch;
