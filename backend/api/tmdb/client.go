package tmdb

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
)

const (
	baseURL = "https://api.themoviedb.org/3"
)

// Client represents a TMDB API client
type Client struct {
	APIKey string
	Token  string
	HTTP   *http.Client
}

// NewClient creates a new TMDB API client
func NewClient(apiKey, token string) *Client {
	return &Client{
		APIKey: apiKey,
		Token:  token,
		HTTP:   &http.Client{},
	}
}

// SearchMovies searches for movies by query
func (c *Client) SearchMovies(query string, page int) (*SearchResponse, error) {
	endpoint := fmt.Sprintf("%s/search/movie", baseURL)
	req, err := http.NewRequest("GET", endpoint, nil)
	if err != nil {
		return nil, err
	}

	q := url.Values{}
	q.Add("api_key", c.APIKey)
	q.Add("query", query)
	q.Add("page", fmt.Sprintf("%d", page))
	req.URL.RawQuery = q.Encode()

	req.Header.Add("Authorization", "Bearer "+c.Token)

	resp, err := c.HTTP.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("unexpected status code: %d", resp.StatusCode)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var result SearchResponse
	if err := json.Unmarshal(body, &result); err != nil {
		return nil, err
	}

	return &result, nil
}

// GetMovie fetches a movie by ID
func (c *Client) GetMovie(id int) (*Movie, error) {
	endpoint := fmt.Sprintf("%s/movie/%d", baseURL, id)
	req, err := http.NewRequest("GET", endpoint, nil)
	if err != nil {
		return nil, err
	}

	q := url.Values{}
	q.Add("api_key", c.APIKey)
	q.Add("append_to_response", "videos,credits")
	req.URL.RawQuery = q.Encode()

	req.Header.Add("Authorization", "Bearer "+c.Token)

	resp, err := c.HTTP.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("unexpected status code: %d", resp.StatusCode)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var result Movie
	if err := json.Unmarshal(body, &result); err != nil {
		return nil, err
	}

	return &result, nil
}

// GetPopularMovies fetches popular movies
func (c *Client) GetPopularMovies(page int) (*MovieListResponse, error) {
	return c.getMoviesList("movie/popular", page)
}

// GetTopRatedMovies fetches top rated movies
func (c *Client) GetTopRatedMovies(page int) (*MovieListResponse, error) {
	return c.getMoviesList("movie/top_rated", page)
}

// GetNowPlayingMovies fetches now playing movies
func (c *Client) GetNowPlayingMovies(page int) (*MovieListResponse, error) {
	return c.getMoviesList("movie/now_playing", page)
}

// GetUpcomingMovies fetches upcoming movies
func (c *Client) GetUpcomingMovies(page int) (*MovieListResponse, error) {
	return c.getMoviesList("movie/upcoming", page)
}

// GetSimilarMovies fetches similar movies to a specific movie
func (c *Client) GetSimilarMovies(movieId int) ([]Movie, error) {
	endpoint := fmt.Sprintf("%s/movie/%d/similar", baseURL, movieId)
	req, err := http.NewRequest("GET", endpoint, nil)
	if err != nil {
		return nil, err
	}

	q := url.Values{}
	q.Add("api_key", c.APIKey)
	q.Add("page", "1")
	req.URL.RawQuery = q.Encode()

	req.Header.Add("Authorization", "Bearer "+c.Token)

	resp, err := c.HTTP.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("unexpected status code: %d", resp.StatusCode)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var result MovieListResponse
	if err := json.Unmarshal(body, &result); err != nil {
		return nil, err
	}

	return result.Results, nil
}

// getMoviesList is a helper function to fetch movie lists
func (c *Client) getMoviesList(endpoint string, page int) (*MovieListResponse, error) {
	fullEndpoint := fmt.Sprintf("%s/%s", baseURL, endpoint)
	req, err := http.NewRequest("GET", fullEndpoint, nil)
	if err != nil {
		return nil, err
	}

	q := url.Values{}
	q.Add("api_key", c.APIKey)
	q.Add("page", fmt.Sprintf("%d", page))
	req.URL.RawQuery = q.Encode()

	req.Header.Add("Authorization", "Bearer "+c.Token)

	resp, err := c.HTTP.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("unexpected status code: %d", resp.StatusCode)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var result MovieListResponse
	if err := json.Unmarshal(body, &result); err != nil {
		return nil, err
	}

	return &result, nil
}
