namespace ColumnAdministrator.Web.Infrastructure.QueryParams {
    /// <summary>
    /// Базовый параметр для всех запросов, которые разбиваются на страницы
    /// </summary>
    public abstract class QueryParamsBase {
        protected QueryParamsBase() {
            Size = 10;
        }

        /// <summary>
        /// Номер текущей страницы
        /// </summary>
        public int? PageIndex { get; set; }

        /// <summary>
        /// Размер страницы
        /// </summary>
        public int? Size { get; set; }

        /// <summary>
        /// Строка поиска
        /// </summary>
        public string Search { get; set; }

        public int CurrentIndex {
            get {
                if (PageIndex.HasValue && PageIndex.Value > 0)
                    return PageIndex.Value;
                return 1;
            }
        }
    }
}