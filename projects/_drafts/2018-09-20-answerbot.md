---
title: AnswerBot
description: "A search engine for parsing and answering plain English questions using NLP techniques."
---

Is it possible to parse a natural language (plain English) question and gather relevant information for it from the internet using Natural Language Processing techniques? AnswerBot is the answer.

AnswerBot is, put simply, a search engine. You input a question, it parses it using the NLP techniques of Part-Of-Speech tagging and dependency parsing and then searches through Wikipedia, making use of semantic similarity calculations, to gather information to answer the input.



# Question Parsing

What essentially needs to be extracted from the question are the keywords and then the words which modify or add detail to those keywords.

Rather than opting for a strict binary “this is a keyword” and “this is additional information” type of parsing, I decided to take a more fuzzy approach due to the intrinsic fuzzy nature of this type of classification: when does a word stop being ‘additional information’ and start being a ‘keyword’? By trying to enforce an algorithm to resolve a word into either category, valuable information about the word is lost, which may result in a less informed and so more inaccurate result - especially given the inaccuracies that arise from trying to resolve such words by simply considering their grammatical dependencies and Part-Of-Speech and the inaccuracies of the SpaCy library itself due to the fundamental difficulty of Natural Language Processing, over which I have no control.

The type of parsing I opted for instead is arranging the relevant terms in the sentence into a spectrum, where terms which are more likely to be ‘keywords’ emerge at the left and those more likely to be ‘detail’ emerge at the right. This essentially means a linear hierarchal structure, since the ‘detail’ terms can be thought of as being below the ‘keyword’ terms in an abstract hierarchy of dependency/importance/etc. This structure is represented internally as a list. Some examples below:

| Natural Language                       | Abstract Hierarchy                |
| -------------------------------------- | --------------------------------- |
| Obama’s age                            | `["Obama", "age"]`                |
| Obama’s dad’s age                      | `["Obama", "dad", "age"]`         |
| the biggest animal ever seen in Europe | `["Europe", "animal", "biggest"]` |

Note how in some of these, the arrangement is subjective. That will be handled in the next section.

Note: Google Search has a feature similar to what is trying to be achieved here called `Featured Snippets` (image below), which seems to make use of a hierarchal structure similar to the one described here (see underlined).

![Google's Featured Snippets](https://i.snag.gy/u10vha.jpg)

## Question Fixing

First of all, some minor pre-processing is performed upon the input. This essentially means a simple algorithm to transform the input sentence to look more like a question - making sure it ends with a `?` and starts with a capital letter.

## Parsing

The `question` is split into `queries` and the queries are parsed into `terms` arranged into the hierarchy as described. (This is the terminology I use in the code). In terms of the backend data types, a `question` is usually represented with SpaCy’s `Document`, the `queries` are `Spans` and, most importantly, the `terms` are `Tokens`.

| My Terminology | SpaCy Representation | Info                                                         |
| -------------- | -------------------- | ------------------------------------------------------------ |
| question       | Document             | This is the question after the `question fixing` pre-processing. |
| query          | Span                 | Usually the Span represents a sentence, but it doesn’t _have_ to be a full sentence. |
| term           | Token                |                                                              |

The core functionality of the parsing is parsing a `Span` object into a hierarchal list of `Tokens`. 

The way this works is by considering the `root` token of the `Span` object - the `token` upon which all the other tokens are grammatically dependent. For each of its children.

In essence, the way this works is by starting out with a list of just one token - (the `root` token - the token from which all the other tokens are grammatically dependent). For each of the children tokens of that token, it decided whether the child should be (in the list) just before the token (prepended) or just after it (appended), or not in the list at all (ignored). Sometimes the root token itself is omitted (ignored). The children tokens of that child then have the same process applied to them in a recursive fashion (as if that child token is now the `root`). The recursion’s termination point is when the `token` being considered has no children (in which case, the token itself may or may not be appended). NB: In the actual code, not only the dependency of the `tokens` but also the Part-Of-Speech is taken slightly into account.

Some python-like pseudocode to help illustrate the basic process:

```python
parse(token,skip=False):
	list=[]
    # prepending
    for child in token:
        if child.dependency in (certain list):
            continue # ignore
        elif child.dependency in (certain list):
            list.extend(parse(child),True) # prepend children's children to but not child itself
        elif child.dependency in (certain list):
            list.extend(parse(child),False) # prepend child and its children
    
    if not skip:
        list.append(token) # add the ('root') token if not skipping it
    
    # appending
    for child in token:
        if child.dependency in (certain list):
            continue # ignore
        elif child.dependency in (certain list):
            list.extend(parse(child),True) # appending children's children to but not child itself
        elif child.dependency in (certain list):
            list.extend(parse(child),False) # append child and its children
            
     return list
```

The lists will essentially hold dependency-names (defined by SpaCy) which together serve as a type of ‘config’ as to which tokens to be added and how. E.g one such list (specifically, the one that defines which tokens to be prepended) in the code looks like:

```python
[
    'nsubj',
    'poss',
    'acl',
    'advcl',
    'relcl',
    'compound',
    'attr',
],
```

# Variations Generation

We now have a hierarchal list of keywords which are parsed from the question, which look something like `["Europe", "animal", "biggest"]`.

Ultimately, the goal is to find pages and extract the relevant information from those pages relating to these keywords. One way of doing this is to look up a page with a title relating to the starting elements of the list (`["Europe", "animal"]`), and to search for data relating to the last element (`"biggest"`) within that page.

That method, however, is not great at all. Parsing an accurate hierarchal list of keywords (especially with Spacy alone) is very difficult due to the intrinsic difficulty of Natural Language Processing, and so the output of the parsing function should not be relied on too heavily.

Even assuming the keywords parsing + hierarchal order is faultless, what if it is easier to find a page relating to `["animal", "Europe"]` than `["Europe", "animal"]`?

Theoretically, there could be some Wikipedia page - called ‘European Animals’, for example, which shows up in the results of “Europe animal” but not in “Europe” by itself or “animal” by itself. This is, of course, an exaggerated example, but for cases similar to these, it would be helpful if we considered when some of the terms are grouped together.

Structure reform: up until now, the structure we have been dealing with is essentially a hierarchal list of terms. If we want to group some of these terms together, we’d need another layer to this list. The structure we are dealing with now shall now be a hierarchal list __of groups__ of terms. 

Illustrating this with the example above, grouping `Europe` and `animal` together would mean going from `[["Europe"], ["animal"]]` to `[["Europe", "animal"]]`.

Getting all these different variants of the terms is what this section is about. (All the permutations of the groupings of the terms). It ultimately means that we consider all of the following (actual program output):

```
[["Europe", "animal", "biggest"]]

[["Europe", "animal"], ["biggest"]]
[["biggest"], ["Europe", "animal"]]

[["Europe"], ["animal", "biggest"]]
[["animal biggest"], ["Europe"]]

[["Europe"], ["animal"], ["biggest"]]
[["Europe"], ["biggest"], ["animal"]]
[["animal"], ["Europe"], ["biggest"]]
[["animal"], ["biggest"], ["Europe"]]
[["biggest"], ["Europe"], ["animal"]]
[["biggest"], ["animal"], ["Europe"]]
```

Note that, here, both the `[["Europe", "animal"], ["biggest"]]` and `[["animal", "biggest"], ["Europe"]]` is considered. This may correspond to finding a Wikipedia article relating to “Europe animal” then finding references to “biggest” within that as well as finding a Wikipedia article relating to “biggest animal” then finding references to “Europe”. One may provide better results than the other - this is the why considering these variants are so important.

### Terminology

I call a group of `terms` a `group`. A `group` is used when grouping certain terms as described. 

 A list of these `groups` is a `grouping` (the total hierarchal structure) but also may be called a `variation` since they can be thought of as being a variant of the hierarchal structure.

Reminder: `terms` are internally `Token` objects not `strings`. (Internally, this may mean slightly faster semantic similarity calculation (more info later) - you don’t need to worry too much about it, though)

## Grouping Combinations

When searching for pages relevant to the parsed terms, etc, we want to consider the different groupings of the terms for a fuller picture. E.g: both `[["home"], ["country"]] ` and `[["home", "country"]] ` (The difference being, in the first example, `home` and `country` are part of different, length-1 groups, whereas in the second example, they are grouped together and are part of the same group). To do this, essentially, we need to get every way of splitting a list into a list of lists.

The way I implemented this is by starting out by grouping everything together, then splitting the list at every possible position (based on the binary pattern). NB: this ‘where to split’ can be thought of as ‘where to put a comma’ to help with understanding.

### Example:

```
list:            0   1   2   3
split positions:   0   1   2
```

Note: the number of different `split positions` is always one less than the length of the list because the only valid split positions are those in-between two elements.

Let’s say 0 = no comma, 1 = comma. The possible split positions in this example will look like the following:

```
000
001
010
011
100
101
110
111
```

(positive integers in binary up to $$2^{n}-1$$ where $$n$$ is the number of split positions)

Splitting a string `abcd` based on these positions will therefore look like:

```
abcd
abc,d
ab,cd
ab,c,d
a,bcd
a,bc,d
a,b,cd
a,b,c,d
```

This can, of course, be extended for an input list of any length, and that is how I implemented the algorithm.

## Grouping Permutations

For every grouping of the terms, we also want to consider all the different ways of ordering the different groups too. E.g: `[["country"], ["home"]]` should be considered as well as `[["home"], ["country"]]`.

This is done using the standard-library `itertools`‘s `permutation` function.

# Searching

Now we have a list of “groupings” (variations) of groups of terms. This section deals with the searching for candidate pages and the parsing of relevant information from those pages for each variation.

## Candidate Searching

Here, I use `candidate` to refer to a potentially relevant Wikipedia Page from which relevant information may potentially be extracted. The aim of this section is to find the best (most relevant) such candidates.

Initially, the first group (which may consist of one or more keywords) of each of the different groupings are run through the Wikipedia search API (I used the python wrapper library called `wikipedia` for this) to get some initial candidates.

The titles of the candidates then have the semantic similarity between them and the group of keywords calculated (provided by SpaCy)  to serve as a metric for relevancy, and those under a certain threshold are discarded.

Relevancy metric (want to maximise) for a given page $$p$$:

$$
s(p_t,g_0)
$$

Where $$s(..,..)$$ is spacy’s semantic similarity function and $$g_0$$ corresponds to the 0-th group of the grouping (first group) and $$p_t$$ corresponds to the page’s title.

Only the titles are used for the elimination because getting the entire content for each candidate, given the amount of candidates at this stage, will mean an almost unfeasibly large number of additional API requests to be made to Wikipedia and may also mean that the semantic similarity calculations take longer to be performed (due to the size of the texts being considered). The amount of external API calls is tried to be kept to a minimum as much as possible because sending and receiving data over the internet takes a relatively long time and the wait times can quickly add up (also, excessive requests to Wikipedia is not very nice to their servers~)

After the elimination, the contents of all the remaining pages are then downloaded through the API, and are kept in order of their relevancy levels - their “score”.

## Page Ranking

Now that we have a list of potentially relevant Wikipedia pages as well as the list of groupings to be considered (from the parsing section), we can now start thinking of parsing relevant data.

To start off the evaluation process, for each grouping, each page is ranked in terms of relevancy to the grouping. This is, again, done with SpaCy’s semantic similarity calculation functionality, however this time, the _whole contents_ of each page are considered.

Ranking metric (want to maximise) for a given page:

$$
\frac{\sum _i^{l\:}\:s\left(p_c,g_i\right)}{l}+s\left(p_t,g_0\right)
$$

| Notation     | Definition                                                   |
| ------------ | ------------------------------------------------------------ |
| $$g$$        | ‘grouping’ (list)                                            |
| $$g_i$$      | $$i$$-th group of the ‘grouping’. The first group is when $$i = 0$$ |
| $$s(..,..)$$ | spacy’s semantic similarity calculation function             |
| $$p$$        | (Wikipedia) page                                             |
| $$p_t$$      | page’s title                                                 |
| $$p_c$$      | page’s content                                               |
| $$l$$        | the length of the `grouping` object (number of `groups`)     |

## Data Searching

Now that we a list of groupings and a weighted list of candidate Wikipedia Pages, all that’s left to do is evaluate each variation - find the relevant data for each variation from the candidates. What this means, more precisely, is to find sentences, given a list of input sentences, that maximise relevancy to the groupings.

Remember that a `grouping` is a list of `groups` of terms. The list of `groups` in every `grouping` is iterated over, and all the sentences in the given input sentences are ranked by their relevancy to the `group`. All but the top (certain number of) sentences are then discarded. The remaining sentences is the list of sentences that is operated on in the next iteration (the scope). In this fashion, by eliminating less relevant sentences for each group, the most relevant sentences for each `grouping` are selected.

The relevancy metric for a certain `group` of terms and a sentence is the semantic similarity calculation between the group and the sentences provided by `SpaCy` + the sum of the individual terms’ semantic similarity to the sentence divided by the number of terms (AKA: the average semantic similarity of the individual terms to the sentence). The second metric, however, part (the one representing the individual terms) is weighted (halved).

The relevancy metric for a certain `group` of terms and a sentence is composed of two metrics:

1. the semantic similarity (provided by SpaCy) between the group and the sentence
2. The sentence has the same keywords parsing and arranging algorithm performed upon it as the one used on input questions (described in the [question parsing section](#parsing)). This metric is the average semantic similarity between each keyword extracted from the sentence and the group.

The 2<sup>nd</sup> metric is weighted (halved).

The relevancy metric of a sentence to a `group` can be represented as (want to maximise):

$$
\sum _i^l\:s\left(x,\:a_i\right)+\frac{1}{2}\left(\sum _i^l\:\left(\frac{\sum _j^k\:s\left(a_i,\:p\left(x\right)_j\right)}{k}\right)\right)
$$

| Notation  | Definition                           |
| --------- | ------------------------------------ |
| $$a$$     | the group                            |
| $$a_i$$   | i-th term of the group               |
| $$x$$     | the sentence                         |
| $$p(..)$$ | parsing algorithm - list of keywords |
| $$l$$     | number of terms in the group         |
| $$k$$     | number of keywords                   |
| $$s(..,..)$$ | spacy’s semantic similarity calculation function             |

