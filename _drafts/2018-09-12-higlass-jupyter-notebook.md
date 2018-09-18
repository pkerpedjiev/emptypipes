---
layout: post
title:  "Retrieving HDF5 data from AWS S3"
description: "Retrieving data from remote HDF5 files is xxx% slower than from local files."
tags: aws s3 hdf5
thumbnail: 
---


python scripts/generate_random_tiles.py 14 -n 100 > data/tile_list.txt; /usr/bin/time python scripts/benchmark_tiles.py data-aws/Rao2014-GM12878-MboI-allreps-filtered.1kb.multires.cool data/tile_list.txt -t 16

M4 Large X2:
## 16 threads: 44 seconds  4 threads: 49 seconds
T2-medium (different data center):

## 16 threads: 63 seconds  4 threads: 83 seconds

T2-medium (same data center):
# random data
## 16 threads: 47 seconds  4 threads: 55 seconds
## 16 threads: 52 seconds  4 threads: 49 seconds

# real data
## 16 threads: 29 seconds   4 threads: 29 seconds
## 16 threads: 28 seconds   4 threads: 29 seconds

# 1 thread: 25 seconds
# 1 thread: 25 seconds

Combined tiles

# real tiles (327 tiles)

# individual aws 1 thread 60 seconds
# individual aws 4 threads 25 seconds

# individual local 1 thread 29 seconds
# individual local 4 threads 17 seoncds

# combined local 4 threads 7 seconds
# combined aws 4 threads 11 seconds

# combined local 1 thread 12 seconds
# combined aws 1 thread 21 seconds


python scripts/generate_random_tiles.py 14 -n 100 > data/tile_list.txt; /usr/bin/time python scripts/benchmark_tiles.py data/Rao2014-GM12878-MboI-allreps-filtered.1kb.multires.cool data/tile_list.txt -t 16

M4 Large X2:
## 16 threads: 6.34 seconds 4 threads: 8.19 seconds
T2-medium (different data center):
## 16 threads: 8 seconds 4 threads: 8 seconds
T2-medium (same data center):
## 16 threads: 8 seconds 4 threads: 7 seconds

# real data

# 1 thread: 13 seconds
# 1 thread: 13 seconds

# 4 threads: 13 seconds
# 4 threads: 13 seconds

# M2 Xlarge (192 IOPS)

38.953776 http://test2.higlass.io/api/v1/tiles/?d=aRuaqCIVSx2HXD09ctbqSA.8.105.105&d=LiXYclAjS5idr5-k0Oo7QA.8.104.104&d=LiXYclAjS5idr5-k0Oo7QA.8.104.105&d=LiXYclAjS5idr5-k0Oo7QA.8.105.105&d=e5WbCLpTQZep787_P8HCUQ.8.104.104&d=e5WbCLpTQZep787_P8HCUQ.8.104.105&d=e5WbCLpTQZep787_P8HCUQ.8.105.105&d=M43TQHoLQbWpmngpV6KbPg.8.104.104&d=M43TQHoLQbWpmngpV6KbPg.8.104.105&d=M43TQHoLQbWpmngpV6KbPg.8.105.105&d=GHBMPlFmTp6awb0VesvIQQ.8.104.104&d=GHBMPlFmTp6awb0VesvIQQ.8.104.105&d=GHBMPlFmTp6awb0VesvIQQ.8.105.105&d=NxYdetsQQXS8E5HifM4OeA.8.104.104&d=NxYdetsQQXS8E5HifM4OeA.8.104.105&d=NxYdetsQQXS8E5HifM4OeA.8.105.105&d=XKdvOmeGRz6eX3oM2e-eNg.8.104.104&d=XKdvOmeGRz6eX3oM2e-eNg.8.104.105&d=XKdvOmeGRz6eX3oM2e-eNg.8.105.105&d=O356BMVpS9uJemtdc8fasA.8.104.104&s=B9PKqdfJQoeg4I1-C2_aQw
28.534587 http://test2.higlass.io/api/v1/tiles/?d=O356BMVpS9uJemtdc8fasA.8.104.105&d=O356BMVpS9uJemtdc8fasA.8.105.105&d=cNse-dLjS8OvE-1xT-ZUgA.8.104.104&d=cNse-dLjS8OvE-1xT-ZUgA.8.104.105&d=cNse-dLjS8OvE-1xT-ZUgA.8.105.105&d=V4H77F5-Rt6yO_7UnTSvhA.8.104.104&d=V4H77F5-Rt6yO_7UnTSvhA.8.104.105&d=V4H77F5-Rt6yO_7UnTSvhA.8.105.105&d=UH5yId-URvCwCaxOrYGa8w.8.104.104&d=UH5yId-URvCwCaxOrYGa8w.8.104.105&d=UH5yId-URvCwCaxOrYGa8w.8.105.105&d=Oee0lvZnRLOIca3ao4QMWg.8.104.104&d=Oee0lvZnRLOIca3ao4QMWg.8.104.105&d=Oee0lvZnRLOIca3ao4QMWg.8.105.105&d=Jsfcd4eGQtGAvRRzMwF0Fg.8.104.104&d=Jsfcd4eGQtGAvRRzMwF0Fg.8.104.105&d=Jsfcd4eGQtGAvRRzMwF0Fg.8.105.105&d=bfKqmZUDTtu_9435iMLf7w.8.104.104&d=bfKqmZUDTtu_9435iMLf7w.8.104.105&d=bfKqmZUDTtu_9435iMLf7w.8.105.105&s=B9PKqdfJQoeg4I1-C2_aQw
24.588409 http://test2.higlass.io/api/v1/tiles/?d=JqZVllLMRxSz6kImcreRZw.8.104.104&d=JqZVllLMRxSz6kImcreRZw.8.104.105&d=JqZVllLMRxSz6kImcreRZw.8.105.105&d=Urf5lpXiQOOa2waqeGQ94Q.8.104.104&d=Urf5lpXiQOOa2waqeGQ94Q.8.104.105&d=Urf5lpXiQOOa2waqeGQ94Q.8.105.105&d=fQO934XkRT-GnGqJ-bvk8Q.8.104.104&d=fQO934XkRT-GnGqJ-bvk8Q.8.104.105&d=fQO934XkRT-GnGqJ-bvk8Q.8.105.105&d=dsn0IU1CSAiSZpp2DXysSA.8.104.104&d=dsn0IU1CSAiSZpp2DXysSA.8.104.105&d=dsn0IU1CSAiSZpp2DXysSA.8.105.105&d=MZsC0_B4TzOhbuLLKRhbQw.8.104.104&d=MZsC0_B4TzOhbuLLKRhbQw.8.104.105&d=MZsC0_B4TzOhbuLLKRhbQw.8.105.105&d=SHe3CRNYSCeLI1xkBIZBnQ.8.104.104&d=SHe3CRNYSCeLI1xkBIZBnQ.8.104.105&d=SHe3CRNYSCeLI1xkBIZBnQ.8.105.105&d=Cdv7HxMdT7aFBIf_ny7_SA.8.104.104&d=Cdv7HxMdT7aFBIf_ny7_SA.8.104.105&s=B9PKqdfJQoeg4I1-C2_aQw

# T2 - medius (394 IOPS)

(cenv3) peter@mbi-cw-l10381:~/projects/log-to-location [master|!?]$ /usr/bin/time bash -c ' tail -n 100 data/access_test.log | grep -v info | head -n 3 | python scripts/time_execution.py http://test.higlass.io -'
15.220992 http://test.higlass.io/api/v1/tiles/?d=aRuaqCIVSx2HXD09ctbqSA.8.105.105&d=LiXYclAjS5idr5-k0Oo7QA.8.104.104&d=LiXYclAjS5idr5-k0Oo7QA.8.104.105&d=LiXYclAjS5idr5-k0Oo7QA.8.105.105&d=e5WbCLpTQZep787_P8HCUQ.8.104.104&d=e5WbCLpTQZep787_P8HCUQ.8.104.105&d=e5WbCLpTQZep787_P8HCUQ.8.105.105&d=M43TQHoLQbWpmngpV6KbPg.8.104.104&d=M43TQHoLQbWpmngpV6KbPg.8.104.105&d=M43TQHoLQbWpmngpV6KbPg.8.105.105&d=GHBMPlFmTp6awb0VesvIQQ.8.104.104&d=GHBMPlFmTp6awb0VesvIQQ.8.104.105&d=GHBMPlFmTp6awb0VesvIQQ.8.105.105&d=NxYdetsQQXS8E5HifM4OeA.8.104.104&d=NxYdetsQQXS8E5HifM4OeA.8.104.105&d=NxYdetsQQXS8E5HifM4OeA.8.105.105&d=XKdvOmeGRz6eX3oM2e-eNg.8.104.104&d=XKdvOmeGRz6eX3oM2e-eNg.8.104.105&d=XKdvOmeGRz6eX3oM2e-eNg.8.105.105&d=O356BMVpS9uJemtdc8fasA.8.104.104&s=B9PKqdfJQoeg4I1-C2_aQw
13.081323 http://test.higlass.io/api/v1/tiles/?d=O356BMVpS9uJemtdc8fasA.8.104.105&d=O356BMVpS9uJemtdc8fasA.8.105.105&d=cNse-dLjS8OvE-1xT-ZUgA.8.104.104&d=cNse-dLjS8OvE-1xT-ZUgA.8.104.105&d=cNse-dLjS8OvE-1xT-ZUgA.8.105.105&d=V4H77F5-Rt6yO_7UnTSvhA.8.104.104&d=V4H77F5-Rt6yO_7UnTSvhA.8.104.105&d=V4H77F5-Rt6yO_7UnTSvhA.8.105.105&d=UH5yId-URvCwCaxOrYGa8w.8.104.104&d=UH5yId-URvCwCaxOrYGa8w.8.104.105&d=UH5yId-URvCwCaxOrYGa8w.8.105.105&d=Oee0lvZnRLOIca3ao4QMWg.8.104.104&d=Oee0lvZnRLOIca3ao4QMWg.8.104.105&d=Oee0lvZnRLOIca3ao4QMWg.8.105.105&d=Jsfcd4eGQtGAvRRzMwF0Fg.8.104.104&d=Jsfcd4eGQtGAvRRzMwF0Fg.8.104.105&d=Jsfcd4eGQtGAvRRzMwF0Fg.8.105.105&d=bfKqmZUDTtu_9435iMLf7w.8.104.104&d=bfKqmZUDTtu_9435iMLf7w.8.104.105&d=bfKqmZUDTtu_9435iMLf7w.8.105.105&s=B9PKqdfJQoeg4I1-C2_aQw
14.503153 http://test.higlass.io/api/v1/tiles/?d=JqZVllLMRxSz6kImcreRZw.8.104.104&d=JqZVllLMRxSz6kImcreRZw.8.104.105&d=JqZVllLMRxSz6kImcreRZw.8.105.105&d=Urf5lpXiQOOa2waqeGQ94Q.8.104.104&d=Urf5lpXiQOOa2waqeGQ94Q.8.104.105&d=Urf5lpXiQOOa2waqeGQ94Q.8.105.105&d=fQO934XkRT-GnGqJ-bvk8Q.8.104.104&d=fQO934XkRT-GnGqJ-bvk8Q.8.104.105&d=fQO934XkRT-GnGqJ-bvk8Q.8.105.105&d=dsn0IU1CSAiSZpp2DXysSA.8.104.104&d=dsn0IU1CSAiSZpp2DXysSA.8.104.105&d=dsn0IU1CSAiSZpp2DXysSA.8.105.105&d=MZsC0_B4TzOhbuLLKRhbQw.8.104.104&d=MZsC0_B4TzOhbuLLKRhbQw.8.104.105&d=MZsC0_B4TzOhbuLLKRhbQw.8.105.105&d=SHe3CRNYSCeLI1xkBIZBnQ.8.104.104&d=SHe3CRNYSCeLI1xkBIZBnQ.8.104.105&d=SHe3CRNYSCeLI1xkBIZBnQ.8.105.105&d=Cdv7HxMdT7aFBIf_ny7_SA.8.104.104&d=Cdv7HxMdT7aFBIf_ny7_SA.8.104.105&s=B9PKqdfJQoeg4I1-C2_aQw



**Does the instance type matter?**

**Does the locality zone matter?**

**What factor does locality play?**

