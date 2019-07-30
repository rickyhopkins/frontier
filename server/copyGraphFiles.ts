import * as shell from 'shelljs';

shell.cp('-R', 'src/modules/*.graphql', 'dist/modules');
