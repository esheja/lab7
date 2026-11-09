export interface Link {
  href: string;
}

export interface BookTitle {
  title: string;
  _links?: { self?: Link };
}

export interface AuthorEntity {
  id: number;
  firstName: string;
  lastName: string;
  books?: BookTitle[];
  _links?: { self?: Link; bio?: Link };
}

export interface BioEntity {
  id: number;
  biodata: string;
}
