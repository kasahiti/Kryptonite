import {faker} from '@faker-js/faker';
import {sample} from 'lodash';

// ----------------------------------------------------------------------

const users = [...Array(24)].map((_, index) => ({
    id: faker.datatype.uuid(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    name: faker.name.fullName(),
    role: sample([
        'User',
        'Admin',
    ]),
}));

export default users;
