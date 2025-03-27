import "./globals.css";

export const metadata = {
  title: "Agri-AI",
  description: "Smart Agricultural Inventory Management AI-powered inventory management, sales tracking, and farmer registration for governmental and NGO organizations focused on food security.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap" rel="stylesheet" /> 
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
