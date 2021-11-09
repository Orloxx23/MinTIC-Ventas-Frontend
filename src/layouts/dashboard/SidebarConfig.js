import { Icon } from '@iconify/react';
import pieChart2Fill from '@iconify/icons-eva/pie-chart-2-fill';
import peopleFill from '@iconify/icons-eva/people-fill';
import shoppingBagFill from '@iconify/icons-eva/shopping-bag-fill';
import baselineSell from '@iconify/icons-ic/baseline-sell';

// ----------------------------------------------------------------------

const getIcon = (name) => <Icon icon={name} width={22} height={22} />;

const sidebarConfig = [
  {
    title: 'tablero',
    path: '/tablero',
    icon: getIcon(pieChart2Fill),
    admin: true
  }, 
  {
    title: 'ventas',
    path: '/ventas',
    icon: getIcon(baselineSell),
    admin: false
  },
  {
    title: 'productos',
    path: '/productos',
    icon: getIcon(shoppingBagFill),
    admin: true
  },
  {
    title: 'usuarios',
    path: '/usuarios',
    icon: getIcon(peopleFill),
    admin: true
  }
];

export default sidebarConfig;
