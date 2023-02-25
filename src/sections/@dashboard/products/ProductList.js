import PropTypes from 'prop-types';
// @mui
import {Grid} from '@mui/material';
import CocktailProductCard from './ProductCard';

// ----------------------------------------------------------------------

ProductList.propTypes = {
    products: PropTypes.array.isRequired,
};

export default function ProductList({products, ...other}) {
    return (
        <Grid container spacing={3} sx={{mt: 2}} {...other}>
            {products.map((product) => (
                <Grid key={product.idDrink} item xs={12} sm={6} md={3}>
                    <CocktailProductCard product={product}/>
                </Grid>
            ))}
        </Grid>
    );
}
