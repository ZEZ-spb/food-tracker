import { useState, useEffect } from 'react'
import type { Transaction, TransactionsPageProps } from '../../types'

export const TransactionsPage = ({ transactions, token, getTransactions,
    //removeTransaction, updateTransaction, 
    currency }: TransactionsPageProps) => {
    const [period, setPeriod] = useState<'1m' | '3m' | '6m' | '1y'>('1m')

    useEffect(() => {
        getTransactions(token, period)
    }, [period])

    const purchases = transactions.filter(t => t.type === 'purchase')
    const expenses = transactions.filter(t => t.type === 'expense' || t.type === 'adjustment')

    const groupByProduct = (items: Transaction[]) => {
        const groups: { [key: number]: Transaction[] } = {}
        items.forEach(t => {
            if (!groups[t.product_id]) groups[t.product_id] = []
            groups[t.product_id].push(t)
        })
        return groups
    }

    const purchaseGroups = groupByProduct(purchases)
    const expenseGroups = groupByProduct(expenses)

    return (
        <div className="container mt-4">
            <h2>Покупки и расход</h2>

            <div className="d-flex gap-2 mb-4">
                {(['1m', '3m', '6m', '1y'] as const).map(p => (
                    <button
                        key={p}
                        className={`btn ${period === p ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setPeriod(p)}
                    >
                        {p === '1m' ? '1 месяц' : p === '3m' ? '3 месяца' : p === '6m' ? '6 месяцев' : '1 год'}
                    </button>
                ))}
            </div>

            {/* <p>Всего транзакций: {transactions.length}</p>
            <p>Покупок: {purchases.length}</p>
            <p>Расходов: {expenses.length}</p> */}

            <h3 className="mt-4">Покупки за {period === '1m' ? '1 месяц' : period === '3m' ? '3 месяца' : period === '6m' ? '6 месяцев' : '1 год'}</h3>
            <table className="table table-bordered">

                <thead>
                    <tr>
                        <th>Продукт</th>
                        <th>Дата</th>
                        <th>Количество</th>
                        <th>Стоимость</th>
                    </tr>
                </thead>

                <tbody>
                    {Object.entries(purchaseGroups).map(([productId, items]) => (
                        <>
                            {items.map((t, index) => (
                                <tr key={t.id}>
                                    {index === 0 && <td rowSpan={items.length}>{t.product.name}</td>}
                                    <td>{new Date(t.created_at).toLocaleDateString('ru-RU')}</td>
                                    <td>{Math.abs(Number(t.quantity_delta))} {t.product.unit}</td>
                                    {/* <td>{t.cost ? `${t.cost} ${t.currency}` : '—'}</td> */}
                                    <td>{t.cost && t.currency === currency ? `${t.cost} ${t.currency}` : '—'}</td>
                                </tr>
                            ))}

                            <tr key={`total-${productId}`} className="table-secondary fw-bold">
                                <td></td>
                                <td>За период</td>
                                <td>{items.reduce((sum, t) => sum + Math.abs(Number(t.quantity_delta)), 0).toFixed(2)} {items[0].product.unit}</td>
                                <td>
                                    {/* {items.reduce((sum, t) => sum + Number(t.cost || 0), 0).toFixed(2)} {items[0].currency || ''} */}
                                    {items.reduce((sum, t) => sum + (t.currency === currency ? Number(t.cost || 0) : 0), 0).toFixed(2)} {currency}
                                </td>
                            </tr>
                        </>
                    ))}

                    <tr className="table-dark fw-bold">
                        <td colSpan={3} className="text-end">Итого за период:</td>
                        <td>
                            {/* {purchases.reduce((sum, t) => sum + Number(t.cost || 0), 0).toFixed(2)} */}
                            {purchases.reduce((sum, t) => sum + (t.currency === currency ? Number(t.cost || 0) : 0), 0).toFixed(2)} {currency}
                        </td>
                    </tr>

                </tbody>

            </table>

            <h3 className="mt-4">Расход за {period === '1m' ? '1 месяц' : period === '3m' ? '3 месяца' : period === '6m' ? '6 месяцев' : '1 год'}</h3>
            <table className="table table-bordered">
                
                <thead>
                    <tr>
                        <th>Продукт</th>
                        <th>Дата</th>
                        <th>Количество</th>
                    </tr>
                </thead>

                <tbody>
                    {Object.entries(expenseGroups).map(([productId, items]) => (
                        <>
                            {items.map((t, index) => (
                                <tr key={t.id}>
                                    {index === 0 && <td rowSpan={items.length}>{t.product.name}</td>}
                                    <td>{new Date(t.created_at).toLocaleDateString('ru-RU')}</td>
                                    <td>{Math.abs(Number(t.quantity_delta))} {t.product.unit}</td>
                                </tr>
                            ))}

                            <tr key={`total-${productId}`} className="table-secondary fw-bold">
                                <td></td>
                                <td>За период</td>
                                <td>{items.reduce((sum, t) => sum + Math.abs(Number(t.quantity_delta)), 0).toFixed(2)} {items[0].product.unit}</td>
                            </tr>
                        </>
                    ))}

                </tbody>

            </table>

        </div>
    )
}