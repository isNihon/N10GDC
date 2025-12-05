// ============================================
// Plantillas de Email desde HTML
// ============================================

const fs = require('fs');
const path = require('path');

// Leer plantillas HTML
const orderArrivalHTML = fs.readFileSync(
    path.join(__dirname, '../templates/orderArrival.html'), 
    'utf8'
);

const lowStockHTML = fs.readFileSync(
    path.join(__dirname, '../templates/lowStock.html'), 
    'utf8'
);

// ============================================
// Función para Material Próximo a Llegar
// ============================================
function orderArrivalTemplate(materials, date, description = 'Los siguientes materiales están programados para llegar:') {
    const rows = materials.map(m => `
        <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 12px;">${m.NUMBERPART || 'N/A'}</td>
            <td style="padding: 12px;">${m.NAMEP || 'Sin nombre'}</td>
            <td style="padding: 12px;">${m.FFIN || 'N/A'}</td>
            <td style="padding: 12px; text-align: center;">${m.CANTIDAD || '0'}</td>
            <td style="padding: 12px;">${m.PROVEEDOR || 'N/A'}</td>
            <td style="padding: 12px;">${m.COLOR || 'N/A'}</td>
        </tr>
    `).join('');

    return orderArrivalHTML
        .replace('{{DATE}}', date)
        .replace('{{TOTAL}}', materials.length)
        .replace('{{DESCRIPTION}}', description)
        .replace('{{ROWS}}', rows);
}

// ============================================
// Función para Material Próximo a Expirar
// ============================================
function lowStockTemplate(materials, days, description = 'Los siguientes materiales están próximos a su fecha de expiración:') {
    const rows = materials.map(m => {
        const isExpired = m.FechaExp && new Date(m.FechaExp) < new Date();
        const expStyle = isExpired ? 'color: #d32f2f; font-weight: bold;' : '';
        
        return `
        <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 12px;">${m.NUMBERPART || 'N/A'}</td>
            <td style="padding: 12px;">${m.NAMEP || 'Sin nombre'}</td>
            <td style="padding: 12px; text-align: center;">${m.CANTIDAD || '0'}</td>
            <td style="padding: 12px;">${m.PROVEEDOR || 'N/A'}</td>
            <td style="padding: 12px;">${m.COLOR || 'N/A'}</td>
            <td style="padding: 12px; text-align: center; ${expStyle}">${m.FechaExp || 'N/A'}</td>
        </tr>
        `;
    }).join('');

    return lowStockHTML
        .replace('{{DAYS}}', days)
        .replace('{{TOTAL}}', materials.length)
        .replace('{{DESCRIPTION}}', description)
        .replace('{{ROWS}}', rows);
}

// ============================================
// EXPORTAR
// ============================================

module.exports = {
    orderArrivalTemplate,
    lowStockTemplate
};
