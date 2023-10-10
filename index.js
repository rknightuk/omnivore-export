import fs from 'fs'
const query = `query Search($after: String, $first: Int, $query: String) {
      search(first: $first, after: $after, query: $query) {
        ... on SearchSuccess {
          edges {
            cursor
            node {
              id
              title
              slug
              url
              pageType
              contentReader
              createdAt
              isArchived
              readingProgressPercent
              readingProgressTopPercent
              readingProgressAnchorIndex
              author
              image
              description
              publishedAt
              ownedByViewer
              originalArticleUrl
              uploadFileId
              labels {
                id
                name
                color
              }
              pageId
              shortId
              quote
              annotation
              state
              siteName
              subscription
              readAt
              savedAt
              wordsCount
              recommendations {
                id
                name
                note
                user {
                  userId
                  name
                  username
                  profileImageURL
                }
                recommendedAt
              }
              highlights {
                ...HighlightFields
              }
            }
          }
          pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
            totalCount
          }
        }
        ... on SearchError {
          errorCodes
        }
      }
    }
    
  fragment HighlightFields on Highlight {
    id
    type
    shortId
    quote
    prefix
    suffix
    patch
    color
    annotation
    createdByMe
    createdAt
    updatedAt
    sharedAt
    highlightPositionPercent
    highlightPositionAnchorIndex
    labels {
      id
      name
      color
      createdAt
    }
  }`

const url = 'https://api-prod.omnivore.app/api/graphql'
const variables = {
    'after': '0',
    'first': 9999,
    'query': 'in:inbox'
}

const requestOptions = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': process.env.API_KEY,
  },
  body: JSON.stringify({
    query: query,
    variables: variables,
  }),
}

const res = await fetch(url, requestOptions)
const json = await res.json()

const links = json.data.search.edges

const data = links.map(l => {
    return `<li><a href="${l.node.url}">${l.node.title}</a></li>`
}).join('\n')

fs.writeFileSync('./index.html', `<html>\n<body>\n<ul>${data}</ul>\n</body>\n</html>`)
