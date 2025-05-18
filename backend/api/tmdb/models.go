package tmdb

// SearchResponse represents a movie search response
type SearchResponse struct {
	Page         int     `json:"page"`
	Results      []Movie `json:"results"`
	TotalResults int     `json:"total_results"`
	TotalPages   int     `json:"total_pages"`
}

// MovieListResponse represents a movie list response
type MovieListResponse struct {
	Page         int     `json:"page"`
	Results      []Movie `json:"results"`
	TotalResults int     `json:"total_results"`
	TotalPages   int     `json:"total_pages"`
}

// Movie represents a movie
type Movie struct {
	ID                  int                 `json:"id"`
	Title               string              `json:"title"`
	OriginalTitle       string              `json:"original_title"`
	Overview            string              `json:"overview"`
	PosterPath          string              `json:"poster_path"`
	BackdropPath        string              `json:"backdrop_path"`
	ReleaseDate         string              `json:"release_date"`
	Popularity          float64             `json:"popularity"`
	VoteAverage         float64             `json:"vote_average"`
	VoteCount           int                 `json:"vote_count"`
	Adult               bool                `json:"adult"`
	GenreIDs            []int               `json:"genre_ids,omitempty"`
	Genres              []Genre             `json:"genres,omitempty"`
	OriginalLanguage    string              `json:"original_language"`
	Video               bool                `json:"video"`
	Runtime             int                 `json:"runtime,omitempty"`
	Status              string              `json:"status,omitempty"`
	TagLine             string              `json:"tagline,omitempty"`
	Budget              int                 `json:"budget,omitempty"`
	Revenue             int                 `json:"revenue,omitempty"`
	Homepage            string              `json:"homepage,omitempty"`
	Videos              *VideoResponse      `json:"videos,omitempty"`
	Credits             *CreditsResponse    `json:"credits,omitempty"`
	ProductionCompanies []ProductionCompany `json:"production_companies,omitempty"`
}

// Genre represents a movie genre
type Genre struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

// VideoResponse represents a videos response
type VideoResponse struct {
	Results []Video `json:"results"`
}

// Video represents a video
type Video struct {
	ID        string `json:"id"`
	Key       string `json:"key"`
	Name      string `json:"name"`
	Site      string `json:"site"`
	Size      int    `json:"size"`
	Type      string `json:"type"`
	Official  bool   `json:"official"`
	Published string `json:"published_at"`
}

// CreditsResponse represents a credits response
type CreditsResponse struct {
	Cast []Cast `json:"cast"`
	Crew []Crew `json:"crew"`
}

// Cast represents a cast member
type Cast struct {
	ID                 int    `json:"id"`
	Name               string `json:"name"`
	Character          string `json:"character"`
	ProfilePath        string `json:"profile_path"`
	Order              int    `json:"order"`
	Gender             int    `json:"gender"`
	CreditID           string `json:"credit_id"`
	KnownForDepartment string `json:"known_for_department"`
}

// Crew represents a crew member
type Crew struct {
	ID                 int    `json:"id"`
	Name               string `json:"name"`
	Job                string `json:"job"`
	Department         string `json:"department"`
	ProfilePath        string `json:"profile_path"`
	Gender             int    `json:"gender"`
	CreditID           string `json:"credit_id"`
	KnownForDepartment string `json:"known_for_department"`
}

// ProductionCompany represents a production company
type ProductionCompany struct {
	ID            int    `json:"id"`
	Name          string `json:"name"`
	LogoPath      string `json:"logo_path"`
	OriginCountry string `json:"origin_country"`
}
