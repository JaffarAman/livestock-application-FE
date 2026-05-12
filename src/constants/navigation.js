// src/constants/navigation.js
// Sidebar navigation config — add/remove items here freely

import {
    MdDashboard,
    MdPets,
    MdCallSplit,
    MdContentCut,
    MdScale,
    MdInventory2,
    MdBarChart,
    MdApartment,
    MdPeople,
} from 'react-icons/md'

export const ADMIN_NAV = [
    {
        group: 'Overview',
        items: [
            { label: 'Dashboard', path: '/admin/dashboard', icon: MdDashboard },
        ],
    },
    {
        group: 'Livestock',
        items: [
            { label: 'Create Batch', path: '/admin/batch/create', icon: MdPets },
            { label: 'Allocation', path: '/admin/allocation', icon: MdCallSplit },
            { label: 'Slaughter', path: '/admin/slaughter', icon: MdContentCut },
            { label: 'Processing', path: '/admin/processing', icon: MdScale },
        ],
    },
    {
        group: 'Inventory & Reports',
        items: [
            { label: 'Inventory', path: '/admin/inventory', icon: MdInventory2 },
            { label: 'Reports', path: '/admin/reports', icon: MdBarChart },
        ],
    },
    {
        group: 'Management',
        items: [
            { label: 'Branches', path: '/admin/branches', icon: MdApartment },
            { label: 'Users', path: '/admin/users', icon: MdPeople },
        ],
    },
]
