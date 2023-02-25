// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name, extension) => <SvgColor src={`/assets/icons/navbar/${name}.${extension}`}
                                            sx={{width: 1, height: 1}}/>;

const navConfig = [
    {
        title: 'Dashboard',
        path: '/app/dashboard',
        icon: icon('accueil', 'png'),
    },
    {
        title: 'Créer évaluation',
        path: '/app/assessment',
        icon: icon('creereval', 'png'),
    },
    {
        title: 'Mes évaluations',
        path: '/app/evaluations',
        icon: icon('evaluation', 'png'),
    },
    {
        title: 'Administration',
        path: '/app/administration',
        icon: icon('admin', 'png'),
    },
    {
        title: 'Mon compte',
        path: '/app/compte',
        icon: icon('user', 'png'),
    },
];

export default navConfig;
