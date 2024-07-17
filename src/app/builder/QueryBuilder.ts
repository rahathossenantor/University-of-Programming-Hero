import { FilterQuery, Query } from "mongoose";

class QueryBuilder<T> {
  modelQuery: Query<T[], T>;
  query: Record<string, unknown>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  search(searchableFields: string[]) {
    const searchTerm: string = this.query?.searchTerm as string || "";
    if (searchTerm) {
      this.modelQuery = this.modelQuery.find(
        {
          $or: searchableFields.map((field) => (
            { [field]: { $regex: searchTerm, $options: "i" } } as FilterQuery<T>
          ))
        }
      );
    }
    return this;
  }

  filter() {
    const filterQueries = { ...this.query };
    const excludedFields: string[] = [
      "searchTerm",
      "sort",
      "limit",
      "page",
      "fields"
    ];
    excludedFields.forEach((field) => delete filterQueries[field]);
    this.modelQuery = this.modelQuery.find(filterQueries as FilterQuery<T>);
    return this;
  }

  sort() {
    const sortBy: string = (this.query?.sort as string)?.split(",")?.join(" ") || "-createdAt";
    this.modelQuery = this.modelQuery.sort(sortBy);
    return this;
  }

  paginate() {
    const page: number = Number(this.query?.page) || 1;
    const limit: number = Number(this.query?.limit) || 10;
    const skip: number = (page - 1) * limit;
    this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    return this;
  }

  limitFields() {
    const fields: string = (this.query?.fields as string)?.split(",")?.join(" ") || "-__v";
    this.modelQuery = this.modelQuery.select(fields);
    return this;
  }

  async countTotal() {
    const allQueries = this.modelQuery.getFilter();
    const totalDocs = await this.modelQuery.model.countDocuments(allQueries);
    const page: number = Number(this.query?.page) || 1;
    const limit: number = Number(this.query?.limit) || 10;
    const totalPages = Math.ceil(totalDocs / limit);

    return {
      page,
      limit,
      totalDocs,
      totalPages
    };
  }
}

export default QueryBuilder;
