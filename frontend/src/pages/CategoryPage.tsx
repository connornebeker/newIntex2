import TopAppBar from '../components/TopAppBar';
import CategoryCards from '../components/CategoryCards';
import AuthorizeView from '../components/AuthorizeView';

export default function CategoryPage() {
  

  return (
    <>
    <AuthorizeView>
      <TopAppBar />
      <CategoryCards />
      </AuthorizeView>
    </>
  );
}

