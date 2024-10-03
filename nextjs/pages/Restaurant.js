import * as React from 'react';
import { useRouter } from 'next/router';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import Button from '@mui/material/Button';

export default function TitlebarImageList() {
  const router = useRouter(); // Initialize the useRouter hook for navigation

  return (
    <ImageList
      sx={{
        width: 1600,
        position: 'relative',
        top: 100,
        height: 270,
        display: 'flex',
        overflowX: 'scroll',
        whiteSpace: 'nowrap',
      }}
      cols={1}
      rowHeight={250}
    >
      {itemData.map((item) => (
        <ImageListItem
          key={item.img}
          sx={{
            display: 'inline-block',
            minWidth: 300,
          }}
        >
          <img
            srcSet={`${item.img}?w=300&fit=crop&auto=format&dpr=2 2x`}
            src={`${item.img}?w=300&fit=crop&auto=format`}
            alt={item.title}
            loading="lazy"
            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
          />
          <ImageListItemBar
            title={
              item.title === 'KFC' ? (
                <Button
                  sx={{
                    backgroundColor: 'transparent',
                    color: 'white',
                    left: -20,
                  }}
                  onClick={() => router.push('/kfc')}
                >
                  {item.title}
                </Button>
              ) : item.title === 'Mcdonald' ? (
                <Button
                  sx={{
                    backgroundColor: 'transparent',
                    color: 'white',
                    left: 0,
                  }}
                  onClick={() => router.push('/mcdonald')}
                >
                  {item.title}
                </Button>
              ) : (
                item.title
              )
            }
          />
        </ImageListItem>
      ))}
    </ImageList>
  );
}

const itemData = [
  {
    img: 'https://static.amarintv.com/images/upload/editor/source/France-%20Spotlight/artboard1copy_229.jpg',
    title: 'KFC',
    rows: 2,
    cols: 2,
    featured: true,
  },
  {
    img: 'https://ocdn.eu/pulscms-transforms/1/ZsNk9kpTURBXy8zNzM2OTFiODJmMzUyM2RkMDlhNDIxOGUwODFlYTAyYy5qcGeSlQMDzQJfzRbAzQzOkwXNBLDNAljeAAGhMAE',
    title: 'Mcdonald',
    author: '@rollelflex_graphy726',
    featured: true,
  },
  {
    img: 'https://wumbo.net/symbols/plus/feature.png',
    title: 'To Be Added',
  },
];