import PropTypes from 'prop-types';
// @mui
import {
  Box,
  Card,
  Link,
  Typography,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText, DialogActions, Button,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import FavoriteIcon from '@mui/icons-material/Favorite';
import JsPDF from 'jspdf';

// utils
import { pink } from '@mui/material/colors';
import { useContext, useEffect, useState } from 'react';

// components
import UserContext from '../../../index';


// ----------------------------------------------------------------------

const StyledProductImg = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
  ':hover': {
    cursor: 'pointer'
  }
});


// ----------------------------------------------------------------------

CocktailProductCard.propTypes = {
  product: PropTypes.object,
};

export default function CocktailProductCard({ product }) {
  const [colorButton, setColor] = useState(pink[500]);
  const [openCocktail, setOpenCocktail] = useState(false);

  const handleClickOpen = () => {
    setOpenCocktail(true);
  };

  const handleClose = () => {
    setOpenCocktail(false);
  };


  const generatePDF = () => {
    const pdf = new JsPDF('horizontal','pt','a4');
    pdf.text(product.strDrink, 20, 20);

    if(product.strInstructions) {
      const textLines = pdf
        .setFont("helvetica")
        .setFontSize(15)
        .splitTextToSize(product.strInstructions, 200);

      pdf.text(textLines, 20, 60)
    }

    pdf.save(`${product.strDrink}.pdf`);
  }

  return (
    <>
      <Card>
        <Box sx={{ pt: '100%', position: 'relative' }}>
          <Link onClick={() => handleClickOpen()}>
            <StyledProductImg alt={product.strDrink} src={product.strDrinkThumb} />
          </Link>
        </Box>

        <Stack spacing={2} sx={{ p: 3, "&:hover": { cursor: "pointer" } }} direction="row" justifyContent="space-between">
          <Link color="inherit" underline="hover">
            <Typography variant="subtitle2" noWrap>
              {product.strDrink}
            </Typography>
          </Link>
          <FavoriteIcon sx={{ color: colorButton, "&:hover": { color: "green", cursor: "pointer" } }} onClick={() => console.log("click")}/>
        </Stack>
      </Card>

      <Dialog
        id="report"
        open={openCocktail}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {product.strDrink}
        </DialogTitle>
        <DialogContent>
          {product.strAlcoholic &&
            <DialogContentText id="alert-dialog-description">
              Type de boisson : {product.strAlcoholic}
              <br/>
              <br/>
              Type de verre : {product.strGlass}
              <br/>
              <br/>
              Instructions : {product.strInstructions}
              <br/>
              <br/>
              Ingrédients :&nbsp;
              {product.strIngredient1} {product.strIngredient2} {product.strIngredient3} {product.strIngredient4} {product.strIngredient5} {product.strIngredient6} {product.strIngredient7}
              {product.strIngredient8} {product.strIngredient9} {product.strIngredient10} {product.strIngredient11} {product.strIngredient12} {product.strIngredient13} {product.strIngredient14}
              {product.strIngredient15}
              <br/>
              <br/>
              Quantités :&nbsp;
              {product.strMeasure1} {product.strMeasure2} {product.strMeasure3} {product.strMeasure4} {product.strMeasure5} {product.strMeasure6} {product.strMeasure7}
              {product.strMeasure8} {product.strMeasure9} {product.strMeasure10} {product.strMeasure11} {product.strMeasure12} {product.strMeasure13} {product.strMeasure14}
              {product.strMeasure15}

            </DialogContentText>
          }
        </DialogContent>
        <DialogActions>
          <Button onClick={generatePDF}>
            Générer PDF
          </Button>
          <Button onClick={handleClose} autoFocus>
            Fermer
          </Button>
        </DialogActions>
      </Dialog>
  </>
  );
}
