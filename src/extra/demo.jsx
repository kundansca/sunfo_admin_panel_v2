<div className="datatables">
<DataTable
    noRecordsText="No results match your search query"
    highlightOnHover
    className="whitespace-nowrap table-hover"
    records={recordsData}
    columns={[
        { accessor: 'id', title: 'ID'},
        {
            accessor: 'firstName',
            title: 'Title',
            sortable: true,
            render: ({ firstName, lastName }) => (
                <div className="flex items-center gap-2">
                    <img src={`/assets/images/profile-${getRandomNumber(1, 34)}.jpeg`} className="w-9 h-9 rounded-full max-w-none" alt="user-profile" />
                    <div className="font-semibold">{firstName + ' ' + lastName}</div>
                </div>
            ),
        },
        {
            accessor: 'country',
            title: 'Brand',
            render: () => (
                <div className="flex items-center gap-2">
                    {/* <img width="24" src={`/assets/images/flags/${getCountry().code}.svg`} className="max-w-none" alt="flag" /> */}
                    <div>kundan</div>
                </div>
            ),
        },
        {
            accessor: 'email',
            title: 'Product code',
            sortable: true,
            render: ({ email }) => (
                <a href={`mailto:${email}`} className="text-primary hover:underline">
                    {email}
                </a>
            ),
        },
        {
            accessor: 'age',
            title: 'Price',
            render: () => (
                <div className="w-4/5 min-w-[100px] h-2.5 bg-[#ebedf2] dark:bg-dark/40 rounded-full flex">
                    <div
                        className={`h-2.5 rounded-full rounded-bl-full text-center text-white text-xs bg-${randomStatusColor()}`}
                        style={{ width: `${getRandomNumber(15, 100)}%` }}
                    ></div>
                </div>
            ),
        },
        { accessor: 'phone', title: 'Phone', sortable: true },
        {
            accessor: 'rating',
            title: 'Rate',
            titleClassName: '!text-center',
            render: ({ id }) => (
                <div className="flex items-center justify-center text-warning">
                    {Array.from(Array(getRandomNumber(1, 5)).keys()).map((i) => {
                        return <IconStar key={i + id} className=" fill-warning" />;
                    })}
                </div>
            ),
        },
        {
            accessor: 'series',
            title: 'Progress',
            render: ({ id }) => (
                <ReactApexChart
                    key={id}
                    type="line"
                    series={[{ data: [21, 9, 36, 12, 44, 25, 59] }]}
                    // @ts-ignore
                    options={chart_options()}
                    height={30}
                    width={150}
                />
            ),
        },
        {
            accessor: 'status',
            title: 'Status',
            render: () => <span className={`badge badge-outline-${randomStatusColor()} `}>{randomStatus()}</span>,
        },
    ]}
    totalRecords={initialRecords.length}
    recordsPerPage={pageSize}
    page={page}
    onPageChange={(p) => setPage(p)}
    recordsPerPageOptions={PAGE_SIZES}
    onRecordsPerPageChange={setPageSize}
    sortStatus={sortStatus}
    onSortStatusChange={setSortStatus}
    minHeight={200}
    paginationText={({ from, to, totalRecords }) => `Showing  ${from} to ${to} of ${totalRecords} entries`}
/>
</div>