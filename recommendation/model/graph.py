
class Node:
    def __init__(self, id):
        self.neighbors = []
        self.id = str(id)


    def addNeighbor(self, neighbor):
        self.neighbors.append(neighbor)

        if isinstance(neighbor, Post):
            neighbor.addUser(self)
        else:
            neighbor.addPost(self)

    def addNeighbors(self, neighbors):
        for n in neighbors:
            self.addNeighbor(n)

    def getNeighbors(self):
        return self.neighbors.copy()

    def __str__(self) -> str:        
        return f"node id {self.id} and neighbors { " ".join([str(n.id) for n in self.getNeighbors()]) }"


class Post(Node):
    def __init__(self, post_id):        
        super().__init__(post_id) 

    def addUser(self, user):
        self.neighbors.append(user)

class User(Node):
    def __init__(self, user_id):
        super().__init__(user_id) 
    
    def addPost(self, post):
        self.neighbors.append(user)

          


class Graph:
    def __init__(self):        
        self.nodes = []

    def getNode(self, node_id):
        for n in self.nodes:
            if str(n.id) == str(node_id):
                return n

        return None

    def addNode(self, node):
        self.nodes.append(node)

    def addNodes(self, nodes):
        self.nodes.extend(nodes)

    def getNeighbors(self, node):
        return self.getNode(node).getNeighbors()

    def getTopNeighbors(self, node: User):
        # queue for neighbors
        posts_queue = [n for n in node.getNeighbors()]

        user_queue = []
        #print("posts", posts_queue)
        for post in posts_queue:
            post_neighbors = post.getNeighbors()
            post_neighbors.remove(node)

            user_queue.extend([ user_n for user_n in post_neighbors if user_n not in user_queue])

        neighbors_rank = []

        for n in user_queue:
            # count common neighbors (posts)
            common_n = [com for com in n.getNeighbors() if com in posts_queue]
            uncommon_n = [com for com in n.getNeighbors() if com not in posts_queue]

            neighbors_rank.append( [n, common_n, uncommon_n])

        # ranked by more posts in common
        neighbors_rank.sort(key=lambda x : len(x[1]), reverse=True)

        return neighbors_rank

    def getRecommendations(self, node: User):
        top_neighbors = self.getTopNeighbors(node)
        recs = []
        for node in top_neighbors:
            recs.extend(node[2])

        return recs

def graphTests():
    user1 = User("user1")
    user2 = User("user2")
    user3 = User("user3")
    user4 = User("user4")

    post1 = Post("post1")
    post2 = Post("post2")
    post3 = Post("post3")
    post4 = Post("post4")

    user1.addNeighbors([post1, post2, post3])
    user2.addNeighbors([post1, post2, post3])
    user2.addNeighbors([post4])
    
    user3.addNeighbor(post1)

    user4.addNeighbor(post3)

    graph = Graph()
    graph.addNodes([post1, post2, post3,post4, user1, user2, user3, user4])
    
    # check all neighbors exist when fetching by id
    assert [post in graph.getNode('user1').getNeighbors() for post in [post1, post2, post3]] == [True, True, True]
    # since they have common post likes, user 1 should be a top neighbor to user 2
    assert user1 in graph.getTopNeighbors(user2)[0]
    # the only recommendation to user1 should be the other post of user 2 they havent liked
    assert graph.getRecommendations(user1)[0] == post4
    
