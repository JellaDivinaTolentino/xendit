import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
    return (
        <Html lang="en">
            <link rel="icon" href="/assets/images/favicon.jpeg" />
            <Head />
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0"
            ></meta>
            <body className="antialiased">
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
