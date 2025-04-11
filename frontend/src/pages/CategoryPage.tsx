import TopAppBar from '../components/TopAppBar';
import CategoryCards from '../components/CategoryCards';
import AuthorizeView from '../components/AuthorizeView';

export default function CategoryPage() {
  // fetches all genres on cards and displays them
  return (
    <>
    <AuthorizeView>
      <TopAppBar />
      <CategoryCards />
      </AuthorizeView>
    </>
  );
}

