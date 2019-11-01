import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

// row of images with certain height as static
// on click need to update the image
// tabs at the bottom.
const useStyles = makeStyles(theme => ({
    
  }));

// need tabs component
//
  export default function SingleProduct() {

    const [loading, setLoading] = useState(false)

    return (
        <Grid container wrap="nowrap">
        {(loading ? Array.from(new Array(3)) : data).map((item, index) => (
          <Box key={index} width={210} marginRight={0.5} my={5}>
            {item ? (
              <img style={{ width: 210, height: 118 }} alt={item.title} src={item.src} />
            ) : (
              <Skeleton variant="rect" width={210} height={118} />
            )}
  
            {item ? (
              <Box paddingRight={2}>
                <Typography gutterBottom variant="body2">
                  {item.title}
                </Typography>
                <Typography display="block" variant="caption" color="textSecondary">
                  {item.channel}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {`${item.views} • ${item.createdAt}`}
                </Typography>
              </Box>
            ) : (
              <React.Fragment>
                <Skeleton />
                <Skeleton width="60%" />
              </React.Fragment>
            )}
          </Box>
        ))}
      </Grid>
    )
  }