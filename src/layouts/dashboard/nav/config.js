// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name, extension) => <SvgColor src={`/assets/icons/navbar/${name}.${extension}`}
                                            sx={{width: 1, height: 1}}/>;

const navConfig = [
    {
        title: 'Mes évaluations',
        path: '/app/evaluations',
        icon: icon('evaluation', 'png'),
        auth: 'ROLE_USER'
    },
    {
        title: 'Créer évaluation',
        path: '/app/assessment',
        icon: icon('creereval', 'png'),
        auth: 'ROLE_USER'
    },
    {
        title: 'Administration',
        path: '/app/administration',
        icon: icon('admin', 'png'),
        auth: 'ROLE_ADMIN'
    },
    {
        title: 'Mon compte',
        path: '/app/compte',
        icon: icon('user', 'png'),
        auth: 'ROLE_USER'
    },
];

export default navConfig;
