import { ApolloClient, gql, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
    uri: 'http://localhost:4000/graphql',
    cache: new InMemoryCache(),
});

client.query({
    query: gql`
        query GetBooks {
            books {
                title
                author
            }
        }
    `,
})
.then((result) => console.log(result));

export default client;
