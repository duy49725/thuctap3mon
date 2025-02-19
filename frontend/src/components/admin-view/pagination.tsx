import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../ui/pagination";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}
const PaginationComponent = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const handleClick = (page: number) => {
    if (page !== currentPage) {
      onPageChange(page);
    }
  };
  const pages = [...Array(totalPages).keys()].map(x => x + 1);
  console.log(totalPages)
  return (
    <div className="flex justify-center mt-4">
      <nav>
        <ul className="flex space-x-2">
          {/*pages.map((page) => (
            <li key={page}>
              <Button
                onClick={() => handleClick(page)}
                className={`px-3 py-1 rounded hover:bg-slate-400 hover:text-slate-600 ${currentPage === page ? 'bg-slate-950 text-white' : 'bg-gray-200 text-gray-800'}`}
              >
                {page}
              </Button>
            </li>
          ))*/}
          <Pagination>
            <PaginationContent>
              {
                currentPage !== 1 && (
                  <PaginationItem>
                    <PaginationPrevious className="cursor-pointer" onClick={() => {
                      onPageChange(currentPage - 1);
                    }} />
                  </PaginationItem>
                )
              }
              {
                pages.map((page) => (
                  <PaginationItem>
                    <PaginationLink
                      className="cursor-pointer"
                      onClick={() => handleClick(page)}
                      isActive={page === currentPage}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))
              }
              {
                currentPage !== pages.length && (
                  <PaginationItem>
                    <PaginationNext className="cursor-pointer" onClick={() => onPageChange(currentPage + 1)} />
                  </PaginationItem>
                )
              }
            </PaginationContent>
          </Pagination>
        </ul>
      </nav>
    </div>
  );
};

export default PaginationComponent;
