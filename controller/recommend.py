import pickle
import sys
import requests
import json

movies = pickle.load(open('./controller/movie_list.pkl', 'rb'))
similarity = pickle.load(open('./controller/similarity.pkl', 'rb'))


def fetch_poster(movie_id):
    url = "https://api.themoviedb.org/3/movie/{}?api_key=ec2ecd7b1d5a1d6996ec92a5ba7edf87&language=en-US".format(
        movie_id)
    data = requests.get(url)
    data = data.json()
    poster_path = data['poster_path']
    return poster_path


movie = int(sys.argv[1])


def recommend(movie):
    recommended_movie_obj = []
    index = movies[movies['movie_id'] == movie].index[0]
    distances = sorted(
        list(enumerate(similarity[index])), reverse=True, key=lambda x: x[1])
    for i in distances[1:9]:
        movie_item = {
            "id": int(movies.iloc[i[0]].movie_id),
            "title": movies.iloc[i[0]].title,
            "poster_path": fetch_poster(movies.iloc[i[0]].movie_id)
        }
        recommended_movie_obj.append(movie_item)

    return recommended_movie_obj


result = recommend(movie)

movie_json = json.dumps(result, indent=2)
with open('./controller/movies.json', 'w') as outfile:
    outfile.write(movie_json)
